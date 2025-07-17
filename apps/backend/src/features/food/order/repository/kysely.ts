import type { Order } from "@/types";
import { Result } from "true-myth";
import type { Pagination } from "@/features/pagination";
import type OrderRepository from "./interface";
import type { OrderRepositoryError, OrderWithItems } from "./interface";
import type { KyselyClient } from "@/features/database/kysely";
import type { Logger } from "@/features/logger";

class OrderKyselyRepository implements OrderRepository {
	constructor(
		private client: KyselyClient,
		private logger: Logger,
	) {}

	public async findById(
		id: string,
	): Promise<Result<OrderWithItems | null, OrderRepositoryError>> {
		try {
			const order = await this.client
				.selectFrom("orders")
				.selectAll()
				.where("id", "=", id)
				.executeTakeFirst();

			if (!order) {
				return Result.ok(null);
			}

			const items = await this.client
				.selectFrom("order_items")
				.selectAll()
				.where("order_id", "=", order.id)
				.execute();

			return Result.ok({
				...order,
				items,
			});
		} catch (err) {
			this.logger.error("failed to find order by id:", id, err);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async findManyByUserId(
		userId: string,
		options: Pagination.Options,
	): Promise<Result<OrderWithItems[], OrderRepositoryError>> {
		try {
			const orders = await this.client
				.selectFrom("orders")
				.selectAll()
				.where("user_id", "=", userId)
				.offset((options.page - 1) * options.per_page)
				.limit(options.per_page)
				.execute();

			const promises = orders.map(async (order) => {
				const items = await this.client
					.selectFrom("order_items")
					.selectAll()
					.where("order_id", "=", order.id)
					.execute();

				return {
					...order,
					items,
				};
			});

			const resolved = await Promise.all(promises);

			return Result.ok(resolved);
		} catch (err) {
			this.logger.error("failed to find orders by user id:", userId, err);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async updateStatusById(
		id: string,
		status: Order.Selectable["status"],
	): Promise<Result<Order.Selectable | null, OrderRepositoryError>> {
		try {
			const order = await this.client
				.updateTable("orders")
				.set({
					status,
				})
				.where("id", "=", id)
				.returningAll()
				.executeTakeFirst();

			return Result.ok(order ?? null);
		} catch (err) {
			this.logger.error(
				"failed to update order status by id:",
				status,
				id,
				err,
			);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async createFromCart(
		cartId: string,
		payload: Order.Insertable,
	): Promise<Result<Order.Selectable, OrderRepositoryError>> {
		try {
			const order = await this.client
				.insertInto("orders")
				.values(payload)
				.returningAll()
				.executeTakeFirstOrThrow();

			await this.client
				.with("_cart_items", (qb) =>
					qb.selectFrom("cart_items").selectAll().where("cart_id", "=", cartId),
				)
				.insertInto("order_items")
				.expression((qb) =>
					qb
						.selectFrom("_cart_items")
						.select([
							"_cart_items.id",
							"_cart_items.image",
							"_cart_items.quantity",
							"_cart_items.price",
							qb.val(order.id).as("order_id"),
						]),
				)
				.execute();

			return Result.ok(order);
		} catch (err) {
			this.logger.error("failed to create order from cart:", err);
			return Result.err("ERR_UNEXPECTED");
		}
	}
}

export default OrderKyselyRepository;
