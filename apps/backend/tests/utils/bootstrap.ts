import 'reflect-metadata'

import { Container } from '@n8n/di'
import { createKyselyClient, KyselyClient } from '@/features/database/kysely'
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
import NodemailerMailer from '@/features/mailer/nodemailer'
import {
  WalletKyselyRepository,
  WalletRepository
} from '@/features/wallet/repository'
import GetWalletUseCase from '@/features/wallet/route/get/use-case'
import { Mailer } from '@/features/mailer'
import TopupWalletUseCase from '@/features/wallet/route/topup/use-case'
import { PaymentService, TestPaymentService } from '@/features/payment/service'
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
import { StorageServiceImplementation } from '@/features/storage/impl'
import { Storage } from '@/features/storage'
import {
  FoodCartRepository,
  FoodCartKyselyRepository
} from '@/features/food/cart/repository'
import {
  CartSetItemUseCase,
  GetCartUseCase,
  CheckoutCartUseCase
} from '@/features/food/cart/use-case'

export const bootstrap = () => {
  // Logger
  const logger = new Logger({ name: 'App' })

  // Database
  const kyselyClient = createKyselyClient()

  // Mailer
  const mailer = new NodemailerMailer(logger)

  // Wallet DI
  const walletRepository = new WalletKyselyRepository(logger, kyselyClient)
  const paymentService = new TestPaymentService(walletRepository, logger)
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
  const createAdvertUseCase = new CreateAdvertUseCase(advertRepository)
  const listAdvertUseCase = new ListAdvertUseCase(advertRepository)
  const updateAdvertUseCase = new UpdateAdvertUseCase(advertRepository)
  const deleteAdvertUseCase = new DeleteAdvertUseCase(advertRepository)

  // Food Item DI
  const foodItemRepository = new FoodItemKyselyRepository(kyselyClient, logger)
  const updateFoodItemUseCase = new UpdateFoodItemUseCase(foodItemRepository)
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

  // Storage DI
  const storageService = new StorageServiceImplementation(
    config.storage.mediaServerUrl
  )

  const app = new HonoApp(logger)

  // Logger
  Container.set(Logger, logger)

  // Database
  Container.set(KyselyClient, kyselyClient)

  // Payment
  Container.set(PaymentService, paymentService)

  // Mailer
  Container.set(Mailer, mailer)

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

  // Storage DI
  Container.set(StorageServiceImplementation, storageService)

  return { app, logger, config }
}

const { app: appClass, logger } = bootstrap()

const app = appClass.create()

export { app, logger }
