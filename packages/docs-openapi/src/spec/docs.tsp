import "@typespec/rest";

using TypeSpec.Http;

@service({
  title: "Grovine API Documentation",
})
namespace ApiDocs;

@example("f47ac10b-58cc-4372-a567-0e02b2c3d479")
scalar Id extends string;

@example("Mary Slessor")
scalar FullName extends string;

@example("HE6G1U")
scalar ReferralCode extends string;

@example("2000-01-01")
scalar DateOfBirth extends string;

@example("+2348123456789")
scalar PhoneNumber extends string;

@example("2021-09-01T12:00:00Z")
scalar DateTime extends string;

@example("745731af4484f323968969eda289aeee")
scalar Token extends string;

@example("123456")
scalar Otp extends string;

enum Role {
  ADMIN,
  USER,
}

@example("mary.slessor@mail.com")
scalar Email extends string;

model Media {
  public_id: Id;

  @example("https://google.com")
  url: string;
}

@route("/api")
@doc("API")
namespace Api {
  namespace Pagination {
    model Options {
      page: int64;
      per_page: int64;
    }

    model Meta {
      ...Api.Pagination.Options;
      total: int64;
    }

    model Paginated<T> {
      data: T[];
      meta: Api.Pagination.Meta;
    }
  }

  @error
  model UnexpectedError {
    @statusCode _code: 500;
    code: "ERR_UNEXPECTED";
  }

  @error
  model BadRequestError {
    @statusCode _code: 400;
    code: "ERR_EXPECTED_DATA_NOT_RECEIVED";
  }

  @error
  model UserNotVerifiedError {
    @statusCode _code: 401;
    code: "ERR_USER_NOT_VERIFIED";
  }

  @error
  model UnauthorizedError {
    @statusCode _code: 401;
    code: "ERR_UNAUTHORIZED";
  }

  @tag("Auth")
  @route("/auth")
  namespace Authentication {
    model User {
      id: Id;
      full_name: FullName;
      email: Email;
      phone_number: PhoneNumber;
      created_at: DateTime;
      updated_at: DateTime | null;
    }

    namespace Verification {
      namespace Verify {
        namespace Request {
          model Body {
            email: Email;
            otp: Otp;
          }
        }

        namespace Response {
          namespace Success {
            model AuthCredentials {
              code: "AUTH_CREDENTIALS";
              data: {
                access_token: Token;
                refresh_token: Token;
              };
            }

            alias Success = AuthCredentials;
          }

          namespace Error {
            @error
            model InvalidOrExpiredOtpError {
              @statusCode _code: 400;
              code: "ERR_INVALID_OR_EXPIRED_OTP";
            }

            alias Error = InvalidOrExpiredOtpError | BadRequestError | UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }
      }

      namespace SendVerificationEmail {
        namespace Request {
          model Body {
            email: Email;
          }
        }

        namespace Response {
          namespace Success {
            model VerificationEmailSent {
              code: "VERIFICATION_EMAIL_SENT";
            }

            alias Success = VerificationEmailSent;
          }

          namespace Error {
            @error
            model VerificationEmailAlreadySentError {
              @statusCode _code: 400;
              code: "ERR_VERIFICATION_EMAIL_ALREADY_SENT";
              data: {
                expires_at: DateTime;
              };
            }

            alias Error = VerificationEmailAlreadySentError | BadRequestError | UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }
      }
    }

    @route("/sign-up")
    namespace SignUp {
      @route("/")
      namespace SignUp {
        namespace Request {
          model Body
            extends OmitProperties<
              Api.Authentication.User,
              "created_at" | "updated_at"
            > {
            referral_code: ReferralCode;
          }
        }

        namespace Response {
          namespace Success {
            model VerificationEmailSent {
              code: "VERIFICATION_EMAIL_SENT";
            }

            alias Success = VerificationEmailSent;
          }

          namespace Error {
            @error
            model EmailAlreadyInUseError {
              @statusCode _code: 409;
              code: "ERR_EMAIL_ALREADY_IN_USE";
            }

            alias Error = EmailAlreadyInUseError | BadRequestError | UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @post
        @doc("Sign up new user")
        op signUp(@body body: Request.Body): Response.Response;
      }

      @route("/verification")
      namespace Verification {
        namespace Verify {
          alias Request = Api.Authentication.Verification.Verify.Request;
          alias Response = Api.Authentication.Verification.Verify.Response;

          @post
          @doc("Verify email")
          op verifyEmail(@body body: Request.Body): Response.Response;
        }

        @route("/resend")
        namespace ResendVerification {
          alias Request = Api.Authentication.Verification.SendVerificationEmail.Request;
          alias Response = Api.Authentication.Verification.SendVerificationEmail.Response;

          @post
          @doc("Resend verification email")
          op resendVerificationEmail(
            @body body: Request.Body,
          ): Response.Response;
        }
      }
    }

    @route("/sign-in")
    namespace SignIn {
      namespace SignIn {
        namespace Request {
          model Body {
            email: Email;
          }
        }

        namespace Response {
          namespace Success {
            alias Success = Api.Authentication.SignUp.SignUp.Response.Success.VerificationEmailSent;
          }

          namespace Error {
            alias Error = UnauthorizedError | UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @post
        @doc("Send email to sign in user")
        op sendSignInEmail(@body body: Request.Body): Response.Response;
      }

      @route("/verification")
      namespace Verification {
        namespace Verify {
          alias Request = Api.Authentication.Verification.Verify.Request;
          alias Response = Api.Authentication.Verification.Verify.Response;

          @post
          @doc("Verify email")
          op verifyEmail(@body body: Request.Body): Response.Response;
        }

        @route("/resend")
        namespace ResendVerification {
          alias Request = Api.Authentication.Verification.SendVerificationEmail.Request;
          alias Response = Api.Authentication.Verification.SendVerificationEmail.Response;

          @post
          @doc("Resend verification email")
          op resendVerificationEmail(
            @body body: Request.Body,
          ): Response.Response;
        }
      }
    }
  }
}

