import 'reflect-metadata'

import { Container } from '@n8n/di'
import { KyselyClient } from './features/database/kysely/index.js'
import { AdvertRepository } from './features/advert/repository/index.js'
import { KyselyAdvertRepository } from './features/advert/repository/index.js'
import {
  CreateAdvertUseCase,
  DeleteAdvertUseCase,
  ListAdvertUseCase,
  UpdateAdvertUseCase
} from './features/advert/use-case.js'
import { Logger } from './features/logger/index.js'
import { HonoApp } from './features/app/hono.js'
import { config } from './features/config/index.js'
import {
  KyselyAuthTokenRepository,
  AuthTokenRepository,
  KyselyAuthUserRepository,
  AuthUserRepository
} from './features/auth/repository/index.js'
import {
  SendSignInVerificationEmailUseCase,
  ResendSignInVerificationEmailUseCase,
  VerifySignInVerificationEmailUseCase,
  SendSignUpVerificationEmailUseCase,
  ResendSignUpVerificationEmailUseCase,
  VerifySignUpVerificationEmailUseCase,
  GetUserProfileUseCase
} from './features/auth/use-case.js'
import {
  WalletKyselyRepository,
  WalletRepository
} from './features/wallet/repository/index.js'
import GetWalletUseCase from './features/wallet/route/get/use-case.js'
import { Mailer, NodemailerMailer } from './features/mailer/index.js'
import TopupWalletUseCase from './features/wallet/route/topup/use-case.js'
import {
  PaymentService,
  PaystackPaymentService
} from './features/payment/service/index.js'
import WithdrawWalletUseCase from './features/wallet/route/withdraw/use-case.js'
import {
  FoodItemRepository,
  FoodItemKyselyRepository
} from './features/food/item/repository/index.js'
import UpdateFoodItemUseCase from './features/food/item/route/update/use-case.js'
import DeleteFoodItemUseCase from './features/food/item/route/delete/use-case.js'
import {
  OrderRepository,
  OrderKyselyRepository
} from './features/food/order/repository/index.js'
import {
  ListOrdersUseCase,
  GetOrderUseCase,
  UpdateOrderStatusUseCase
} from './features/food/order/use-case.js'
import {
  TransactionRepository,
  TransactionKyselyRepository
} from './features/transaction/repository/index.js'
import {
  ListTransactionsUseCase,
  GetTransactionUseCase
} from './features/transaction/use-case.js'
import {
  StorageService,
  CloudinaryStorageService
} from './features/storage/service/index.js'
import {
  FoodCartRepository,
  FoodCartKyselyRepository
} from './features/food/cart/repository/index.js'
import {
  CartSetItemUseCase,
  GetCartUseCase,
  CheckoutCartUseCase
} from './features/food/cart/use-case.js'
import { WebhookUseCase } from './features/payment/use-case.js'
import CreateFoodItemUseCase from './features/food/item/route/create/use-case.js'
import GetFoodItemUseCase from './features/food/item/route/get/use-case.js'
import ListFoodItemsUseCase from './features/food/item/route/list/use-case.js'
import { createKyselyPgClient } from './features/database/kysely/pg/index.js'
import { ChefRepository, KyselyChefRepository, ChefUserLikeRepository, KyselyChefUserLikeRepository, ChefUserRatingRepository, KyselyChefUserRatingRepository } from './features/chef/repository/index.js'
import { ChefService, ChefServiceImpl } from './features/chef/service/implementation.js'
import { CreateChefUseCase, GetActiveChefProfileUseCase, GetChefUseCase, ListChefUseCase, UpdateActiveChefProfileUseCase, LikeChefProfileByIdUseCase, DislikeChefProfileByIdUseCase, RateChefProfileByIdUseCase } from './features/chef/use-case.js'
import {
  ReferralRepository,
  KyselyReferralRepository
} from './features/referral/repository/index.js'
import {
  FoodRecipeRepository,
  KyselyFoodRecipeRepository,
  RecipeUserLikeRepository,
  KyselyRecipeUserLikeRepository,
  RecipeUserRatingRepository,
  KyselyRecipeUserRatingRepository
} from './features/food/recipe/repository/index.js'
import CreateFoodRecipeUseCase from './features/food/recipe/route/create/use-case.js'
import DeleteFoodRecipeUseCase from './features/food/recipe/route/delete/use-case.js'
import GetFoodRecipeUseCase from './features/food/recipe/route/get/use-case.js'
import ListFoodRecipeUseCase from './features/food/recipe/route/list/use-case.js'
import UpdateFoodRecipeUseCase from './features/food/recipe/route/update/use-case.js'
import {
  OpenTelemetryService,
  OpenTelemetryServiceImplementation
} from './features/otel/service/index.js'
import { OpenTelemetryLogger } from './features/otel/logger/index.js'

export const bootstrap = async () => {
  // OpenTelemetry DI
  const openTelemetryService = new OpenTelemetryServiceImplementation()
  const openTelemetryLogger = new OpenTelemetryLogger(openTelemetryService, {
    name: 'App'
  })

  const logger = openTelemetryLogger

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

  // Referral DI
  const referralRepository = new KyselyReferralRepository(kyselyClient, logger)

  // Auth DI
  const authUserRepository = new KyselyAuthUserRepository(kyselyClient, logger)
  const authTokenRepository = new KyselyAuthTokenRepository(
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
      referralRepository,
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
  const advertRepository = new KyselyAdvertRepository(kyselyClient, logger)
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
  const chefUserLikeRepository = new KyselyChefUserLikeRepository(
    kyselyClient,
    logger
  )
  const chefUserRatingRepository = new KyselyChefUserRatingRepository(
    kyselyClient,
    logger
  )
  const chefService = new ChefServiceImpl(
    chefRepository,
    chefUserLikeRepository,
    chefUserRatingRepository,
    logger
  )
  const createChefUseCase = new CreateChefUseCase(chefRepository)
  const getChefUseCase = new GetChefUseCase(chefRepository)
  const listChefUseCase = new ListChefUseCase(chefRepository)
  const getActiveChefProfileUseCase = new GetActiveChefProfileUseCase(
    chefRepository,
    logger
  )
  const updateActiveChefProfileUseCase = new UpdateActiveChefProfileUseCase(
    chefRepository,
    storageService
  )
  const likeChefProfileByIdUseCase = new LikeChefProfileByIdUseCase(chefService)
  const dislikeChefProfileByIdUseCase = new DislikeChefProfileByIdUseCase(
    chefService
  )
  const rateChefProfileByIdUseCase = new RateChefProfileByIdUseCase(chefService)

  // Food Recipe DI
  const foodRecipeRepository = new KyselyFoodRecipeRepository(
    kyselyClient,
    logger
  )
  const recipeUserLikeRepository = new KyselyRecipeUserLikeRepository(kyselyClient, logger)
  const recipeUserRatingRepository = new KyselyRecipeUserRatingRepository(kyselyClient, logger)
  const recipeService = new RecipeServiceImpl(foodRecipeRepository, recipeUserLikeRepository, recipeUserRatingRepository, logger)
  const createFoodRecipeUseCase = new CreateFoodRecipeUseCase(
    foodRecipeRepository,
    chefRepository,
    storageService
  )
  const listFoodRecipeUseCase = new ListFoodRecipeUseCase(foodRecipeRepository)
  const getFoodRecipeUseCase = new GetFoodRecipeUseCase(foodRecipeRepository)
  const updateFoodRecipeUseCase = new UpdateFoodRecipeUseCase(
    foodRecipeRepository,
    chefRepository,
    storageService
  )
  const deleteFoodRecipeUseCase = new DeleteFoodRecipeUseCase(
    foodRecipeRepository,
    chefRepository
  )
  const likeRecipeByIdUseCase = new LikeRecipeByIdUseCase(recipeService)
  const dislikeRecipeByIdUseCase = new DislikeRecipeByIdUseCase(recipeService)
  const rateRecipeByIdUseCase = new RateRecipeByIdUseCase(recipeService)

  const app = new HonoApp(logger)

  // Database
  Container.set(KyselyClient, kyselyClient)

  // Payment
  Container.set(PaymentService, paymentService)

  // Storage DI
  Container.set(StorageService, storageService)

  // OpenTelemetry DI
  Container.set(OpenTelemetryService, openTelemetryService)
  Container.set(Logger, openTelemetryLogger)

  // Mailer DI
  Container.set(Mailer, mailer)

  // Payment DI
  Container.set(WebhookUseCase, webhookUseCase)

  // Wallet DI
  Container.set(WalletRepository, walletRepository)
  Container.set(GetWalletUseCase, getWalletUseCase)
  Container.set(TopupWalletUseCase, topupWalletUseCase)
  Container.set(WithdrawWalletUseCase, withdrawWalletUseCase)

  // Referral DI
  Container.set(ReferralRepository, referralRepository)

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
  Container.set(ChefUserLikeRepository, chefUserLikeRepository)
  Container.set(ChefUserRatingRepository, chefUserRatingRepository)
  Container.set(ChefService, chefService)
  Container.set(CreateChefUseCase, createChefUseCase)
  Container.set(GetChefUseCase, getChefUseCase)
  Container.set(ListChefUseCase, listChefUseCase)
  Container.set(GetActiveChefProfileUseCase, getActiveChefProfileUseCase)
  Container.set(UpdateActiveChefProfileUseCase, updateActiveChefProfileUseCase)
  Container.set(LikeChefProfileByIdUseCase, likeChefProfileByIdUseCase)
  Container.set(DislikeChefProfileByIdUseCase, dislikeChefProfileByIdUseCase)
  Container.set(RateChefProfileByIdUseCase, rateChefProfileByIdUseCase)

  // Food Recipe DI
  Container.set(FoodRecipeRepository, foodRecipeRepository)
  Container.set(RecipeUserLikeRepository, recipeUserLikeRepository)
  Container.set(RecipeUserRatingRepository, recipeUserRatingRepository)
  Container.set(RecipeService, recipeService)
  Container.set(CreateFoodRecipeUseCase, createFoodRecipeUseCase)
  Container.set(ListFoodRecipeUseCase, listFoodRecipeUseCase)
  Container.set(GetFoodRecipeUseCase, getFoodRecipeUseCase)
  Container.set(UpdateFoodRecipeUseCase, updateFoodRecipeUseCase)
  Container.set(DeleteFoodRecipeUseCase, deleteFoodRecipeUseCase)
  Container.set(LikeRecipeByIdUseCase, likeRecipeByIdUseCase)
  Container.set(DislikeRecipeByIdUseCase, dislikeRecipeByIdUseCase)
  Container.set(RateRecipeByIdUseCase, rateRecipeByIdUseCase)

  return { app, logger, config, openTelemetryService }
}
