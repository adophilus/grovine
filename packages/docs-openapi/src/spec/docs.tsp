import "@typespec/rest";

using TypeSpec.Http;

@service({
  title: "Grovine API Documentation",
})
namespace ApiDocs;

@route("/api")
@doc("API")
namespace Api {
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

  @example("Seafood")
  scalar FoodType extends string;

  @example(4800.50)
  scalar Price extends numeric;

  @example("Nigeria")
  scalar CuisineRegion extends string;

  @example("123456")
  scalar Otp extends string;

  model ImageFile extends File {
    contentType: "image/jpeg" | "image/png" | "image/webp";
  }

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

    model Query {
      @query
      @minValue(1)
      page?: int64;

      @query
      @minValue(10)
      @maxValue(100)
      per_page?: int64;
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
  model NotFoundError<T> {
    @statusCode _code: 404;
    code: "${T}_NOT_FOUND";
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

  @tag("Onboarding")
  @route("/onboarding")
  namespace Onboarding {
    @route("/preferences")
    namespace Preferences {
      namespace Request {
        model Body {
          foods: FoodType[];
          regions: CuisineRegion[];
        }
      }

      namespace Response {
        namespace Success {
          model PreferencesSet {
            code: "PREFERENCES_SET";
          }

          alias Success = PreferencesSet;
        }

        namespace Error {
          @doc("One or more foods entered were not found")
          model FoodNotFoundError {
            @statusCode _code: 404;
            code: "ERR_FOOD_NOT_FOUND";
          }

          @doc("One or more regions entered were not found")
          model RegionNotFoundError {
            @statusCode _code: 404;
            code: "ERR_REGION_NOT_FOUND";
          }

          alias Error =
            | FoodNotFoundError
            | RegionNotFoundError
            | BadRequestError
            | UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @post
      @doc("Set the user preferences during onboarding")
      op setUserPreferences(@body body: Request.Body): Response.Response;
    }
  }

  @tag("Food")
  @route("/foods")
  namespace Food {
    model Food {
      id: Id;
      name: string;
      description: string;
      price: Price;
      media: Media;
      is_available: boolean;
      created_at: DateTime;
      updated_at: DateTime | null;
    }

    namespace List {
      namespace Request {
        alias Query = Pagination.Query;
      }

      namespace Response {
        namespace Success {
          alias Success = Pagination.Paginated<Food>;
        }

        namespace Error {
          alias Error = UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @get
      @doc("List foods")
      op listFoods(...Request.Query): Response.Response;
    }

    @route("/types")
    namespace Types {
      namespace Response {
        namespace Success {
          alias Success = FoodType[];
        }

        namespace Error {
          alias Error = UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @doc("Fetch all food types")
      @get
      op getFoodTypes(): Response.Response;
    }

    namespace Create {
      namespace Request {
        model Body {
          name: HttpPart<string>;
          description: HttpPart<string>;
          price: HttpPart<Price>;
          image: HttpPart<ImageFile>;
        }
        model Headers {
          @header
          contentType: "multipart/form-data";
        }
      }

      namespace Response {
        namespace Success {
          model Success {
            @statusCode _code: 201;
            code: "FOOD_CREATED";
            data: Food;
          }
        }

        namespace Error {
          alias Error = BadRequestError | UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @post
      @doc("Create a new food item")
      op createFood(
        ...Request.Headers,
        @multipartBody body: Request.Body,
      ): Response.Response;
    }

    @route("/{id}")
    namespace FoodById {
      namespace Get {
        namespace Request {
          model Path {
            @path
            id: Id;
          }
        }

        namespace Response {
          namespace Success {
            model Success {
              @statusCode _code: 200;
              data: Food;
            }
          }

          namespace Error {
            alias Error = NotFoundError<"FOOD"> | UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @get
        @doc("Get a food item by ID")
        op getFoodById(@path id: Request.Path): Response.Response;
      }
    }

    namespace Update {
      namespace Request {
        model Path {
          @path
          id: Id;
        }
        model Body {
          name?: HttpPart<string>;
          description?: HttpPart<string>;
          price?: HttpPart<Price>;
          image?: HttpPart<ImageFile>;
          is_available?: HttpPart<boolean>;
        }
        model Headers {
          @header
          contentType: "multipart/form-data";
        }
      }

      namespace Response {
        namespace Success {
          model Success {
            @statusCode _code: 200;
            code: "FOOD_UPDATED";
            data: Food;
          }
        }

        namespace Error {
          alias Error = NotFoundError<"FOOD"> | BadRequestError | UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @patch
      @doc("Update a food item by ID")
      op updateFoodById(
        ...Request.Headers,
        @path id: Request.Path,
        @multipartBody body: Request.Body,
      ): Response.Response;
    }

    namespace Delete {
      namespace Request {
        model Path {
          @path
          id: Id;
        }
      }

      namespace Response {
        namespace Success {
          model Success {
            @statusCode _code: 200;
            code: "FOOD_DELETED";
          }
        }

        namespace Error {
          alias Error = NotFoundError<"FOOD"> | UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @delete
      @doc("Delete a food item by ID")
      op deleteFoodById(@path id: Request.Path): Response.Response;
    }
  }

  @tag("Cuisine")
  @route("/cuisine")
  namespace Cuisine {
    @route("/regions")
    namespace Region {
      namespace Response {
        namespace Success {
          alias Success = Api.CuisineRegion[];
        }

        namespace Error {
          alias Error = UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @doc("Fetch all cuisine regions")
      @get
      op getRegions(): Response.Response;
    }
  }

  @tag("Advertisement")
  @route("/ads")
  namespace Advertisement {
    model Advertisement {
      id: Id;
      media: Media;
      expires_at: DateTime;
      created_at: DateTime;
    }

    namespace Create {
      namespace Request {
        model Headers {
          @header
          contentType: "multipart/form-data";
        }

        model Body {
          expires_at: HttpPart<DateTime>;
          image: HttpPart<ImageFile>;
        }
      }

      namespace Response {
        namespace Success {
          model Success {
            @statusCode _code: 201;
            code: "ADVERTISEMENT_CREATED";
          }
        }

        namespace Error {
          alias Error = BadRequestError | UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @post
      @doc("Create new advertisement")
      op createAdvertisement(
        ...Request.Headers,
        @multipartBody body: Request.Body,
      ): Response.Response;
    }

    namespace List {
      namespace Request {
        alias Query = Pagination.Query;
      }

      namespace Response {
        namespace Success {
          alias Success = Pagination.Paginated<Advertisement>;
        }

        namespace Error {
          alias Error = UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @get
      @doc("List advertisements")
      op listAdvertisements(...Request.Query): Response.Response;
    }

    @route("/{id}")
    namespace Update {
      namespace Request {
        model Headers {
          @header
          contentType: "multipart/form-data";
        }

        model Path {
          @path
          id: Id;
        }

        model Body {
          expires_at?: HttpPart<DateTime>;
          image?: HttpPart<ImageFile>;
        }
      }

      namespace Response {
        namespace Success {
          model Success {
            @statusCode _code: 200;
            code: "ADVERTISEMENT_UPDATED";
          }
        }

        namespace Error {
          alias Error = NotFoundError<"ADVERTISEMENT"> | BadRequestError | UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @patch
      @doc("Update an advertisement by id")
      op updateAdvertisementById(
        ...Request.Headers,
        ...Request.Path,
        @multipartBody body: Request.Body,
      ): Response.Response;
    }

    @route("/{id}")
    namespace Delete {
      namespace Request {
        model Path {
          @path
          id: Id;
        }
      }

      namespace Response {
        namespace Success {
          model Success {
            @statusCode _code: 200;
            code: "ADVERTISEMENT_DELETED";
          }
        }

        namespace Error {
          alias Error = NotFoundError<"ADVERTISEMENT"> | BadRequestError | UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @delete
      @doc("Delete an advertisement by id")
      op deleteAdvertisementById(...Request.Path): Response.Response;
    }
  }
}

