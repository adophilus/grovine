import 'reflect-metadata'

import { Container } from '@n8n/di'
import {
  AdvertRepository,
  KyselyAdvertRepository
} from '@/features/advert/repository'
import {
  CreateAdvertUseCase,
  DeleteAdvertUseCase,
  ListAdvertUseCase,
  UpdateAdvertUseCase
} from '@/features/advert/use-case'
import { HonoApp } from '@/features/app'
import {
  AuthTokenRepository,
  AuthUserRepository,
  KyselyAuthTokenRepository,
  KyselyAuthUserRepository
} from '@/features/auth/repository'
import {
  GetUserProfileUseCase,
  ResendSignInVerificationEmailUseCase,
  ResendSignUpVerificationEmailUseCase,
  SendSignInVerificationEmailUseCase,
  SendSignUpVerificationEmailUseCase,
  VerifySignInVerificationEmailUseCase,
  VerifySignUpVerificationEmailUseCase
} from '@/features/auth/use-case'
import {
  ChefRepository,
  ChefUserLikeRepository,
  ChefUserRatingRepository,
  KyselyChefRepository,
  KyselyChefUserLikeRepository,
  KyselyChefUserRatingRepository
} from '@/features/chef/repository'
import { ChefService, ChefServiceImpl } from '@/features/chef/service'
import {
  CreateChefUseCase,
  DislikeChefProfileByIdUseCase,
  GetActiveChefProfileUseCase,
  GetChefUseCase,
  LikeChefProfileByIdUseCase,
  ListChefUseCase,
  RateChefProfileByIdUseCase,
  UpdateActiveChefProfileUseCase
} from '@/features/chef/use-case'
import { config } from '@/features/config'
import { KyselyClient } from '@/features/database/kysely'
import { createKyselyPgLiteClient } from '@/features/database/kysely/pglite'
import { UpdateUserRoleUseCase } from '@/features/dev/users/use-case'
import {
  FoodCartKyselyRepository,
  FoodCartRepository
} from '@/features/food/cart/repository'
import {
  CartSetItemUseCase,
  CheckoutCartUseCase,
  GetCartUseCase
} from '@/features/food/cart/use-case'
import {
  FoodItemKyselyRepository,
  FoodItemRepository
} from '@/features/food/item/repository'
import CreateFoodItemUseCase from '@/features/food/item/route/create/use-case'
import DeleteFoodItemUseCase from '@/features/food/item/route/delete/use-case'
import GetFoodItemUseCase from '@/features/food/item/route/get/use-case'
import ListFoodItemsUseCase from '@/features/food/item/route/list/use-case'
import UpdateFoodItemUseCase from '@/features/food/item/route/update/use-case'
import {
  OrderKyselyRepository,
  OrderRepository
} from '@/features/food/order/repository'
import {
  GetOrderUseCase,
  ListOrdersUseCase,
  UpdateOrderStatusUseCase
} from '@/features/food/order/use-case'
import {
  FoodRecipeRepository,
  KyselyFoodRecipeRepository,
  KyselyRecipeUserLikeRepository,
  KyselyRecipeUserRatingRepository,
  RecipeUserLikeRepository,
  RecipeUserRatingRepository
} from '@/features/food/recipe/repository'
import CreateFoodRecipeUseCase from '@/features/food/recipe/route/create/use-case'
import DeleteFoodRecipeUseCase from '@/features/food/recipe/route/delete/use-case'
import GetFoodRecipeUseCase from '@/features/food/recipe/route/get/use-case'
import ListFoodRecipeUseCase from '@/features/food/recipe/route/list/use-case'
import UpdateFoodRecipeUseCase from '@/features/food/recipe/route/update/use-case'
import {
  RecipeService,
  RecipeServiceImpl
} from '@/features/food/recipe/service'
import {
  DislikeRecipeByIdUseCase,
  LikeRecipeByIdUseCase,
  RateRecipeByIdUseCase
} from '@/features/food/recipe/use-case'
import {
  FoodSearchRepository,
  KyselyFoodSearchRepository
} from '@/features/food/search/repository'
import SearchFoodItemsUseCase from '@/features/food/search/route/search/use-case'
import { Logger } from '@/features/logger'
import { Mailer, MockMailer } from '@/features/mailer'
import { MockPaymentService, PaymentService } from '@/features/payment/service'
import { WebhookUseCase } from '@/features/payment/use-case'
import {
  KyselyReferralRepository,
  ReferralRepository
} from '@/features/referral/repository'
import { MockStorageService, StorageService } from '@/features/storage/service'
import {
  TransactionKyselyRepository,
  TransactionRepository
} from '@/features/transaction/repository'
import {
  GetTransactionUseCase,
  ListTransactionsUseCase
} from '@/features/transaction/use-case'
import {
  WalletKyselyRepository,
  WalletRepository
} from '@/features/wallet/repository'
import {
  GetWalletUseCase,
  TopupWalletUseCase,
  WithdrawWalletUseCase
} from '@/features/wallet/use-case'

export const bootstrap = async () => {
  // Logger
  const logger = new Logger({ name: 'App' })

  // Database
  const kyselyClient = await createKyselyPgLiteClient()

  // Storage DI
  const storageService = new MockStorageService()

  // Mailer DI
  const mailer = new MockMailer()

  // Wallet DI
  const walletRepository = new WalletKyselyRepository(logger, kyselyClient)
  const paymentService = new MockPaymentService(walletRepository)
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

  // Food Search DI
  const foodSearchRepository = new KyselyFoodSearchRepository(
    kyselyClient,
    logger
  )
  const searchFoodItemUseCase = new SearchFoodItemsUseCase(foodSearchRepository)

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
    chefUserRatingRepository
  )
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
  const likeChefProfileByIdUseCase = new LikeChefProfileByIdUseCase(chefService)
  const dislikeChefProfileByIdUseCase = new DislikeChefProfileByIdUseCase(
    chefService
  )
  const rateChefProfileByIdUseCase = new RateChefProfileByIdUseCase(chefService)

  // Dev DI
  const updateUserRoleUseCase = new UpdateUserRoleUseCase(authUserRepository)

  // Food Recipe DI
  const foodRecipeRepository = new KyselyFoodRecipeRepository(
    kyselyClient,
    logger
  )
  const recipeUserLikeRepository = new KyselyRecipeUserLikeRepository(
    kyselyClient,
    logger
  )
  const recipeUserRatingRepository = new KyselyRecipeUserRatingRepository(
    kyselyClient,
    logger
  )
  const recipeService = new RecipeServiceImpl(
    foodRecipeRepository,
    recipeUserLikeRepository,
    recipeUserRatingRepository
  )
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

  // Logger DI
  Container.set(Logger, logger)

  // Database DI
  Container.set(KyselyClient, kyselyClient)

  // Payment DI
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

  // Food Search DI
  Container.set(FoodSearchRepository, foodSearchRepository)
  Container.set(SearchFoodItemsUseCase, searchFoodItemUseCase)

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

  // Dev DI
  Container.set(UpdateUserRoleUseCase, updateUserRoleUseCase)

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

  return { app, logger, config }
}

const { app: appClass, logger } = await bootstrap()

const app = appClass.create()

export { app, logger }
