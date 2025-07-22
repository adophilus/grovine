import 'reflect-metadata'

import { Container } from '@n8n/di'
import { KyselyClient } from '@/features/database/kysely'
import { AdvertRepository } from '@/features/advert/repository'
import { AdvertKyselyRepository } from '@/features/advert/repository/kysely'
import {
  CreateAdvertUseCase,
  DeleteAdvertUseCase,
  ListAdvertUseCase,
  UpdateAdvertUseCase
} from '@/features/advert/use-case'
import { Logger } from '@/features/logger'
import { HonoApp } from '@/features/app'
import { config } from '@/features/config'
import {
  AuthTokenKyselyRepository,
  AuthTokenRepository,
  AuthUserKyselyRepository,
  AuthUserRepository
} from '@/features/auth/repository'
import {
  SendSignInVerificationEmailUseCase,
  ResendSignInVerificationEmailUseCase,
  VerifySignInVerificationEmailUseCase,
  SendSignUpVerificationEmailUseCase,
  ResendSignUpVerificationEmailUseCase,
  VerifySignUpVerificationEmailUseCase,
  GetUserProfileUseCase
} from '@/features/auth/use-case'
import {
  WalletKyselyRepository,
  WalletRepository
} from '@/features/wallet/repository'
import GetWalletUseCase from '@/features/wallet/route/get/use-case'
import { Mailer, NodemailerMailer } from '@/features/mailer'
import TopupWalletUseCase from '@/features/wallet/route/topup/use-case'
import {
  PaymentService,
  PaystackPaymentService
} from '@/features/payment/service'
import WithdrawWalletUseCase from '@/features/wallet/route/withdraw/use-case'
import {
  FoodItemRepository,
  FoodItemKyselyRepository
} from '@/features/food/item/repository'
import UpdateFoodItemUseCase from '@/features/food/item/route/update/use-case'
import DeleteFoodItemUseCase from '@/features/food/item/route/delete/use-case'
import {
  OrderRepository,
  OrderKyselyRepository
} from '@/features/food/order/repository'
import {
  ListOrdersUseCase,
  GetOrderUseCase,
  UpdateOrderStatusUseCase
} from '@/features/food/order/use-case'
import {
  TransactionRepository,
  TransactionKyselyRepository
} from '@/features/transaction/repository'
import {
  ListTransactionsUseCase,
  GetTransactionUseCase
} from '@/features/transaction/use-case'
import {
  StorageService,
  CloudinaryStorageService
} from '@/features/storage/service'
import {
  FoodCartRepository,
  FoodCartKyselyRepository
} from '@/features/food/cart/repository'
import {
  CartSetItemUseCase,
  GetCartUseCase,
  CheckoutCartUseCase
} from '@/features/food/cart/use-case'
import { WebhookUseCase } from './features/payment/use-case'
import CreateFoodItemUseCase from './features/food/item/route/create/use-case'
import GetFoodItemUseCase from './features/food/item/route/get/use-case'
import ListFoodItemsUseCase from './features/food/item/route/list/use-case'
import { createKyselyPgClient } from './features/database/kysely/pg'
import { ChefRepository } from '@/features/chef/repository'
import { KyselyChefRepository } from '@/features/chef/repository'
import {
  CreateChefUseCase,
  GetActiveChefProfileUseCase,
  GetChefUseCase,
  ListChefUseCase,
  UpdateActiveChefProfileUseCase
} from '@/features/chef/use-case'
import UpdateActiveChefProfileRoute from './features/chef/route/profile/update'

export const bootstrap = async () => {
  // Logger
  const logger = new Logger({ name: 'App' })

  // Database
  const kyselyClient = await createKyselyPgClient()

  // Storage DI
  const storageService = new CloudinaryStorageService(
    config.storage.mediaServerUrl
  )

  // Mailer DI
  const mailer = new NodemailerMailer(logger)

  // Wallet DI
  const walletRepository = new WalletKyselyRepository(logger, kyselyClient)
  const paymentService = new PaystackPaymentService(walletRepository, logger)
  const webhookUseCase = new WebhookUseCase(paymentService)
  const getWalletUseCase = new GetWalletUseCase(walletRepository)
  const topupWalletUseCase = new TopupWalletUseCase(
    walletRepository,
    paymentService
  )
  const withdrawWalletUseCase = new WithdrawWalletUseCase()

  // Auth DI
  const authUserRepository = new AuthUserKyselyRepository(kyselyClient, logger)
  const authTokenRepository = new AuthTokenKyselyRepository(
    kyselyClient,
    logger
  )
  const sendSignInVerificationEmailUseCase =
    new SendSignInVerificationEmailUseCase(
      authUserRepository,
      authTokenRepository,
      mailer
    )
  const resendSignInVerificationEmailUseCase =
    new ResendSignInVerificationEmailUseCase(
      authUserRepository,
      authTokenRepository,
      mailer
    )
  const verifySignInVerificationEmailUseCase =
    new VerifySignInVerificationEmailUseCase(
      authUserRepository,
      authTokenRepository,
      mailer
    )
  const sendSignUpVerificationEmailUseCase =
    new SendSignUpVerificationEmailUseCase(
      authUserRepository,
      authTokenRepository,
      walletRepository,
      mailer
    )
  const resendSignUpVerificationEmailUseCase =
    new ResendSignUpVerificationEmailUseCase(
      authUserRepository,
      authTokenRepository,
      mailer
    )
  const verifySignUpVerificationEmailUseCase =
    new VerifySignUpVerificationEmailUseCase(
      authUserRepository,
      authTokenRepository,
      mailer
    )
  const getUserProfileUseCase = new GetUserProfileUseCase()

  // Advert DI
  const advertRepository = new AdvertKyselyRepository(kyselyClient, logger)
  const createAdvertUseCase = new CreateAdvertUseCase(
    advertRepository,
    storageService
  )
  const listAdvertUseCase = new ListAdvertUseCase(advertRepository)
  const updateAdvertUseCase = new UpdateAdvertUseCase(
    advertRepository,
    storageService
  )
  const deleteAdvertUseCase = new DeleteAdvertUseCase(advertRepository)

  // Food Item DI
  const foodItemRepository = new FoodItemKyselyRepository(kyselyClient, logger)
  const createFoodItemUseCase = new CreateFoodItemUseCase(
    foodItemRepository,
    storageService
  )
  const getFoodItemUseCase = new GetFoodItemUseCase(foodItemRepository)
  const listFoodItemUseCase = new ListFoodItemsUseCase(foodItemRepository)
  const updateFoodItemUseCase = new UpdateFoodItemUseCase(
    foodItemRepository,
    storageService
  )
  const deleteFoodItemUseCase = new DeleteFoodItemUseCase(foodItemRepository)

  // Food Order DI
  const orderRepository = new OrderKyselyRepository(kyselyClient, logger)
  const listOrdersUseCase = new ListOrdersUseCase(orderRepository)
  const getOrderUseCase = new GetOrderUseCase(orderRepository)
  const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderRepository)

  // Food Cart DI
  const foodCartRepository = new FoodCartKyselyRepository(
    kyselyClient,
    foodItemRepository,
    logger
  )
  const cartSetItemUseCase = new CartSetItemUseCase(foodCartRepository)
  const getCartUseCase = new GetCartUseCase(foodCartRepository)
  const checkoutCartUseCase = new CheckoutCartUseCase(
    foodCartRepository,
    orderRepository,
    paymentService
  )

  // Transaction DI
  const transactionRepository = new TransactionKyselyRepository(
    kyselyClient,
    logger
  )
  const listTransactionsUseCase = new ListTransactionsUseCase(
    transactionRepository
  )
  const getTransactionUseCase = new GetTransactionUseCase(transactionRepository)

  // Chef DI
  const chefRepository = new KyselyChefRepository(kyselyClient, logger)
  const createChefUseCase = new CreateChefUseCase(chefRepository)
  const getChefUseCase = new GetChefUseCase(chefRepository)
  const listChefUseCase = new ListChefUseCase(chefRepository)
  const getActiveChefProfileUseCase = new GetActiveChefProfileUseCase(
    chefRepository
  )
  const updateActiveChefProfileUseCase = new UpdateActiveChefProfileUseCase(
    chefRepository,
    storageService
  )

  const app = new HonoApp(logger)

  // Logger
  Container.set(Logger, logger)

  // Database
  Container.set(KyselyClient, kyselyClient)

  // Payment
  Container.set(PaymentService, paymentService)

  // Storage DI
  Container.set(StorageService, storageService)

  // Mailer DI
  Container.set(Mailer, mailer)

  // Payment DI
  Container.set(WebhookUseCase, webhookUseCase)

  // Wallet DI
  Container.set(WalletRepository, walletRepository)
  Container.set(GetWalletUseCase, getWalletUseCase)
  Container.set(TopupWalletUseCase, topupWalletUseCase)
  Container.set(WithdrawWalletUseCase, withdrawWalletUseCase)

  // Auth DI
  Container.set(AuthUserRepository, authUserRepository)
  Container.set(AuthTokenRepository, authTokenRepository)
  Container.set(
    SendSignInVerificationEmailUseCase,
    sendSignInVerificationEmailUseCase
  )
  Container.set(
    ResendSignInVerificationEmailUseCase,
    resendSignInVerificationEmailUseCase
  )
  Container.set(
    VerifySignInVerificationEmailUseCase,
    verifySignInVerificationEmailUseCase
  )
  Container.set(
    SendSignUpVerificationEmailUseCase,
    sendSignUpVerificationEmailUseCase
  )
  Container.set(
    ResendSignUpVerificationEmailUseCase,
    resendSignUpVerificationEmailUseCase
  )
  Container.set(
    VerifySignUpVerificationEmailUseCase,
    verifySignUpVerificationEmailUseCase
  )
  Container.set(GetUserProfileUseCase, getUserProfileUseCase)

  // Advert DI
  Container.set(AdvertRepository, advertRepository)
  Container.set(CreateAdvertUseCase, createAdvertUseCase)
  Container.set(ListAdvertUseCase, listAdvertUseCase)
  Container.set(UpdateAdvertUseCase, updateAdvertUseCase)
  Container.set(DeleteAdvertUseCase, deleteAdvertUseCase)

  // Food Item DI
  Container.set(FoodItemRepository, foodItemRepository)
  Container.set(CreateFoodItemUseCase, createFoodItemUseCase)
  Container.set(GetFoodItemUseCase, getFoodItemUseCase)
  Container.set(ListFoodItemsUseCase, listFoodItemUseCase)
  Container.set(UpdateFoodItemUseCase, updateFoodItemUseCase)
  Container.set(DeleteFoodItemUseCase, deleteFoodItemUseCase)

  // Food Order DI
  Container.set(OrderRepository, orderRepository)
  Container.set(ListOrdersUseCase, listOrdersUseCase)
  Container.set(GetOrderUseCase, getOrderUseCase)
  Container.set(UpdateOrderStatusUseCase, updateOrderStatusUseCase)

  // Food Cart DI
  Container.set(FoodCartRepository, foodCartRepository)
  Container.set(CartSetItemUseCase, cartSetItemUseCase)
  Container.set(GetCartUseCase, getCartUseCase)
  Container.set(CheckoutCartUseCase, checkoutCartUseCase)

  // Transaction DI
  Container.set(TransactionRepository, transactionRepository)
  Container.set(ListTransactionsUseCase, listTransactionsUseCase)
  Container.set(GetTransactionUseCase, getTransactionUseCase)

  // Chef DI
  Container.set(ChefRepository, chefRepository)
  Container.set(CreateChefUseCase, createChefUseCase)
  Container.set(GetChefUseCase, getChefUseCase)
  Container.set(ListChefUseCase, listChefUseCase)
  Container.set(GetActiveChefProfileUseCase, getActiveChefProfileUseCase)
  Container.set(UpdateActiveChefProfileUseCase, updateActiveChefProfileUseCase)

  return { app, logger, config }
}
