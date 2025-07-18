import { Container } from '@n8n/di'
import { createKyselyClient, KyselyClient } from './features/database/kysely'
import { AdvertRepository } from './features/advert/repository'
import { AdvertKyselyRepository } from './features/advert/repository/kysely'
import {
  CreateAdvertUseCase,
  DeleteAdvertUseCase,
  ListAdvertUseCase,
  UpdateAdvertUseCase
} from './features/advert/use-case'
import { Logger } from './features/logger'
import { HonoApp } from './features/app'
import { config } from './features/config'
import {
  AuthTokenKyselyRepository,
  AuthTokenRepository,
  AuthUserKyselyRepository,
  AuthUserRepository
} from './features/auth/repository'
import {
  SendSignInVerificationEmailUseCase,
  ResendSignInVerificationEmailUseCase,
  VerifySignInVerificationEmailUseCase,
  SendSignUpVerificationEmailUseCase,
  ResendSignUpVerificationEmailUseCase,
  VerifySignUpVerificationEmailUseCase,
  GetUserProfileUseCase
} from './features/auth/use-case'
import NodemailerMailer from './features/mailer/nodemailer'
import {
  WalletKyselyRepository,
  WalletRepository
} from './features/wallet/repository'
import GetWalletUseCase from './features/wallet/route/get/use-case'
import { Mailer } from './features/mailer'
import TopupWalletUseCase from './features/wallet/route/topup/use-case'
import {
  PaymentService,
  PaystackPaymentService
} from './features/payment/service'
import WithdrawWalletUseCase from './features/wallet/route/withdraw/use-case'
import {
  FoodItemRepository,
  FoodItemKyselyRepository
} from './features/food/item/repository'
import UpdateFoodItemUseCase from './features/food/item/route/update/use-case'
import DeleteFoodItemUseCase from './features/food/item/route/delete/use-case'

export const bootstrap = () => {
  const logger = new Logger({ name: 'App' })

  const kyselyClient = createKyselyClient()
  const mailer = new NodemailerMailer(logger)

  const walletRepository = new WalletKyselyRepository(logger, kyselyClient)
  const paymentService = new PaystackPaymentService(walletRepository, logger)

  const getWalletUseCase = new GetWalletUseCase(walletRepository)
  const topupWalletUseCase = new TopupWalletUseCase(
    walletRepository,
    paymentService
  )
  const withdrawWalletUseCase = new WithdrawWalletUseCase()

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

  const advertRepository = new AdvertKyselyRepository(kyselyClient, logger)
  const createAdvertUseCase = new CreateAdvertUseCase(advertRepository)
  const listAdvertUseCase = new ListAdvertUseCase(advertRepository)
  const updateAdvertUseCase = new UpdateAdvertUseCase(advertRepository)
  const deleteAdvertUseCase = new DeleteAdvertUseCase(advertRepository)

  // Food Item DI
  const foodItemRepository = new FoodItemKyselyRepository(kyselyClient, logger)
  const updateFoodItemUseCase = new UpdateFoodItemUseCase(foodItemRepository)
  const deleteFoodItemUseCase = new DeleteFoodItemUseCase(foodItemRepository)

  const app = new HonoApp(logger)

  Container.set(Logger, logger)

  Container.set(KyselyClient, kyselyClient)

  Container.set(PaymentService, paymentService)

  Container.set(Mailer, mailer)

  Container.set(WalletRepository, walletRepository)
  Container.set(GetWalletUseCase, getWalletUseCase)
  Container.set(TopupWalletUseCase, topupWalletUseCase)
  Container.set(WithdrawWalletUseCase, withdrawWalletUseCase)

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

  Container.set(AdvertRepository, advertRepository)
  Container.set(CreateAdvertUseCase, createAdvertUseCase)
  Container.set(ListAdvertUseCase, listAdvertUseCase)
  Container.set(UpdateAdvertUseCase, updateAdvertUseCase)
  Container.set(DeleteAdvertUseCase, deleteAdvertUseCase)

  // Food Item DI
  Container.set(FoodItemRepository, foodItemRepository)
  Container.set(UpdateFoodItemUseCase, updateFoodItemUseCase)
  Container.set(DeleteFoodItemUseCase, deleteFoodItemUseCase)

  return { app, logger, config }
}
