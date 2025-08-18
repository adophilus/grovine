import "@typespec/http";

using Http;

@service(#{ title: "Grovine API Documentation" })
namespace ApiDocs;

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
  scalar FoodCategory extends string;

  @example(4800.50)
  @minValue(0)
  scalar Price extends numeric;

  @example("Nigeria")
  scalar CuisineRegion extends string;

  @example("12345")
  scalar Otp extends string;

  model VideoFile extends File {
    contentType: "video/mp4" | "video/webm" | "video/ogg";
  }

  model ImageFile extends File {
    contentType: "image/jpeg" | "image/png" | "image/webp";
  }

  model WithoutTimestamp<T> {
    ...OmitProperties<T, "created_at" | "updated_at" | "deleted_at">;
  }

  enum Role {
    ADMIN,
    USER,
  }

  @example("mary.slessor@mail.com")
  scalar Email extends string;

  @example("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30")
  scalar Jwt extends string;

  @error
  model ZodFlattenedError {
    formErrors: string[];

    @example(#{ name: #["Required"], age: #["Required"] })
    fieldErrors: unknown;
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
    data: ZodFlattenedError;
  }

  @error
  model NotFoundError<T> {
    @statusCode _code: 404;
    code: "ERR_${T}_NOT_FOUND";
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
                access_token: Jwt;
                refresh_token: Jwt;
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
            model UserAlreadyVerifiedError {
              @statusCode _code: 400;
              code: "ERR_USER_ALREADY_VERIFIED";
            }

            @error
            model VerificationEmailAlreadySentError {
              @statusCode _code: 400;
              code: "ERR_VERIFICATION_EMAIL_ALREADY_SENT";
              data: {
                expires_at: DateTime;
              };
            }

            @error
            model TokenNotExpiredError {
              @statusCode _code: 400;
              code: "ERR_TOKEN_NOT_EXPIRED";
            }

            alias Error =
              | TokenNotExpiredError
              | VerificationEmailAlreadySentError
              | UserAlreadyVerifiedError
              | NotFoundError<"USER">
              | BadRequestError
              | UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }
      }
    }

    @route("/sign-up")
    namespace SignUp {
      namespace SignUp {
        namespace Request {
          model Body {
            ...WithoutTimestamp<OmitProperties<Api.Authentication.User, "id">>;
            referral_code?: ReferralCode;
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
          namespace Request {
            model Body {
              email: Email;
              otp: Otp;
            }
          }

          namespace Response {
            namespace Success {
              model Success {
                code: "AUTH_CREDENTIALS";
                data: {
                  access_token: Jwt;
                  refresh_token: Jwt;
                };
              }
            }

            namespace Error {
              @error
              model InvalidOrExpiredTokenError {
                @statusCode _code: 400;
                code: "ERR_INVALID_OR_EXPIRED_TOKEN";
              }

              alias Error = InvalidOrExpiredTokenError | UnexpectedError;
            }

            alias Response = Success.Success | Error.Error;
          }

          @post
          @doc("Verify email")
          op verifySignUpEmail(@body body: Request.Body): Response.Response;
        }

        @route("/resend")
        namespace ResendVerification {
          namespace Request {
            model Body
              extends Api.Authentication.Verification.SendVerificationEmail.Request.Body {}
          }

          namespace Response {
            namespace Success {
              alias Success = Api.Authentication.Verification.SendVerificationEmail.Response.Success.Success;
            }

            namespace Error {
              alias Error = Api.Authentication.Verification.SendVerificationEmail.Response.Error.Error;
            }

            alias Response = Success.Success | Error.Error;
          }

          @post
          @doc("Resend verification email")
          op resendSignUpVerificationEmail(
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
            alias Error = NotFoundError<"USER"> | BadRequestError | UnexpectedError;
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
          op verifySignInEmail(@body body: Request.Body): Response.Response;
        }

        @route("/resend")
        namespace ResendVerification {
          alias Request = Api.Authentication.Verification.SendVerificationEmail.Request;
          alias Response = Api.Authentication.Verification.SendVerificationEmail.Response;

          @post
          @doc("Resend verification email")
          op resendSignInVerificationEmail(
            @body body: Request.Body,
          ): Response.Response;
        }
      }
    }

    @route("/profile")
    namespace Profile {
      namespace Request {

      }

      namespace Response {
        namespace Success {
          model UserProfile {
            @statusCode _code: 200;
            code: "USER_PROFILE";
            data: User;
          }

          alias Success = UserProfile;
        }

        namespace Error {
          alias Error = NotFoundError<"USER"> | UnauthorizedError | UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @get
      @doc("Get user profile")
      op getProfile(): Response.Response;
    }
  }

  @tag("Onboarding")
  @route("/onboarding")
  namespace Onboarding {
    @route("/preferences")
    namespace Preferences {
      namespace Request {
        model Body {
          foods: FoodCategory[];
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
          @error
          @doc("One or more regions entered were not found")
          model RegionNotFoundError {
            @statusCode _code: 404;
            code: "ERR_REGION_NOT_FOUND";
          }

          @error
          model UserAlreadyOnboardedError {
            @statusCode _code: 409;
            code: "ERR_USER_ALREADY_ONBOARDED";
          }

          alias Error =
            | UserAlreadyOnboardedError
            | UserNotVerifiedError
            | NotFoundError<"FOOD_TYPE">
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

  @tag("Search")
  namespace Search {
    namespace Request {
      model Query extends Pagination.Query {
        @query
        q?: string;
      }
    }

    namespace Error {
      alias Error = NotFoundError<"ITEM"> | UnexpectedError;
    }

    namespace Response {
      alias Response = Api.Food.Item.List.Response.Response;
    }

    @route("/search")
    @get
    @doc("Search and list food items")
    op searchFoodItems(...Request.Query): Response.Response;
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
        model CategoriesQuery {
          @query
          categories?: FoodCategory[];
        }

        alias Query = Pagination.Query & CategoriesQuery;
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

    @route("/categories")
    namespace Category {
      namespace Response {
        namespace Success {
          alias Success = FoodCategory[];
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
      op createFoodItem(
        ...Request.Headers,
        @multipartBody body: Request.Body,
      ): Response.Response;
    }

    @tag("Food Item")
    @route("/items")
    namespace Item {
      model Item {
        id: Id;
        name: string;
        image: Media;
        video_url: string;
        price: numeric;
        created_at: DateTime;
        updated_at: DateTime | null;
      }

      namespace Create {
        namespace Request {
          model Body {
            name: HttpPart<string>;
            video_url: HttpPart<string>;
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
              code: "ITEM_CREATED";
              data: Item;
            }
          }

          namespace Error {
            alias Error = BadRequestError | UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @post
        @doc("Create a new item")
        op createItem(
          ...Request.Headers,
          @multipartBody body: Request.Body,
        ): Response.Response;
      }

      namespace List {
        namespace Response {
          namespace Success {
            model Success {
              code: "LIST";
              data: Pagination.Paginated<Item>;
            }
          }

          namespace Error {
            alias Error = UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @get
        @doc("List items")
        op listItems(...Pagination.Query): Response.Response;
      }

      @route("/{id}")
      namespace ById {
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
                code: "ITEM_FOUND";
                data: Item;
              }
            }

            namespace Error {
              alias Error = NotFoundError<"ITEM"> | UnexpectedError;
            }

            alias Response = Success.Success | Error.Error;
          }

          @get
          @doc("Get an item by ID")
          op getItemById(...Request.Path): Response.Response;
        }

        namespace Update {
          namespace Request {
            model Path {
              @path
              id: Id;
            }
            model Body {
              name?: HttpPart<string>;
              video_url?: HttpPart<string>;
              price?: HttpPart<Price>;
              image?: HttpPart<ImageFile>;
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
                code: "ITEM_UPDATED";
                data: Item;
              }
            }

            namespace Error {
              alias Error = NotFoundError<"ITEM"> | BadRequestError | UnexpectedError;
            }

            alias Response = Success.Success | Error.Error;
          }

          @patch(#{ implicitOptionality: false })
          @doc("Update an item by ID")
          op updateItemById(
            ...Request.Headers,
            ...Request.Path,
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
                code: "ITEM_DELETED";
              }
            }

            namespace Error {
              alias Error = NotFoundError<"ITEM"> | UnexpectedError;
            }

            alias Response = Success.Success | Error.Error;
          }

          @delete
          @doc("Delete an item by ID")
          op deleteItemById(...Request.Path): Response.Response;
        }
      }
    }

    @tag("Food Cart")
    @route("/carts")
    namespace Cart {
      model CartItem {
        id: Id;
        image: Media;
        quantity: integer;
        price: Price;
        food_item_id: Id;
        cart_id: Id;
        created_at: DateTime;
        updated_at: DateTime | null;
      }

      model CartItemGroup {
        image: Media;
        items: CartItem[];
        total_price: Price;
      }

      model Cart {
        id: Id;
        items: CartItemGroup[];
        user_id: Id;
        created_at: DateTime;
        updated_at: DateTime | null;
      }

      namespace SetItem {
        namespace Request {
          model Body {
            id: Id;

            @minValue(0)
            quantity: integer;
          }
        }

        namespace Response {
          namespace Success {
            model ItemAddedToCart {
              code: "ITEM_ADDED_TO_CART";
            }

            alias Success = ItemAddedToCart;
          }

          namespace Error {
            alias Error = NotFoundError<"ITEM"> | BadRequestError | UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @put
        @doc("Set an item in the cart")
        op setItemInCart(@body body: Request.Body): Response.Response;
      }

      namespace Get {
        namespace Response {
          namespace Success {
            model CartFound {
              code: "CART_FOUND";
              data: Cart;
            }

            alias Success = CartFound;
          }

          namespace Error {
            alias Error = UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @get
        @doc("Get the user's cart")
        op getCart(): Response.Response;
      }

      @route("/checkout")
      namespace Checkout {
        namespace Request {
          model DeliveryBase {
            address: string;
            note_for_rider?: string;
          }

          @discriminator("type")
          model DeliveryNow extends DeliveryBase {
            type: "NOW";
          }

          @discriminator("type")
          model DeliveryScheduled extends DeliveryBase {
            type: "SCHEDULED";
            scheduled_at: DateTime;
          }

          union Delivery {
            now: DeliveryNow,
            scheduled: DeliveryScheduled,
          }

          model Body {
            delivery: Delivery;
            promo_code?: string;
            payment_method: "ONLINE" | "WALLET" | "PAY_FOR_ME";
          }
        }

        namespace Response {
          namespace Success {
            model CheckoutSuccessful {
              code: "CHECKOUT_SUCCESSFUL";
              data: {
                order_id: Id;

                @doc("The URL to the payment page if payment method is ONLINE")
                url?: string;
              };
            }

            alias Success = CheckoutSuccessful;
          }

          namespace Error {
            @error
            model EmptyCartError {
              @statusCode _code: 400;
              code: "ERR_CART_EMPTY";
            }

            alias Error = EmptyCartError | UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @post
        @doc("Checkout the user's cart")
        op checkoutCart(@body body: Request.Body): Response.Response;
      }
    }

    @route("/orders")
    @tag("Food Order")
    namespace Order {
      alias OrderStatusSimple = "ONGOING" | "COMPLETED" | "CANCELLED";
      alias OrderStatus =
        | "AWAITING_PAYMENT"
        | "PREPARING"
        | "IN_TRANSIT"
        | "DELIVERED"
        | "CANCELLED";

      model OrderItem {
        id: Id;
        image: Media;
        quantity: integer;
        price: Price;
        created_at: DateTime;
        updated_at: DateTime | null;
      }

      model Order {
        id: Id;
        status: OrderStatus;
        items: OrderItem[];
        payment_method: "ONLINE" | "WALLET" | "PAY_FOR_ME";
        price: Price;
        user_id: Id;
        created_at: DateTime;
        updated_at: DateTime | null;
      }

      namespace List {
        namespace Request {
          model Query extends Pagination.Query {
            @query
            status: OrderStatusSimple;
          }
        }

        namespace Response {
          namespace Success {
            model Success {
              code: "LIST";
              data: Pagination.Paginated<Order>;
            }
          }

          namespace Error {
            alias Error = UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @get
        @doc("List orders")
        op listOrders(...Request.Query): Response.Response;
      }

      @route("/{id}")
      namespace ById {
        namespace UpdateStatus {
          namespace Request {
            model Path {
              @path
              id: Id;
            }

            model Body {
              status: OrderStatus;
            }
          }

          namespace Response {
            namespace Success {
              model Success {
                code: "ORDER_STATUS_UPDATED";
              }
            }

            namespace Error {
              alias Error = NotFoundError<"ORDER"> | BadRequestError | UnexpectedError;
            }

            alias Response = Success.Success | Error.Error;
          }

          @put
          @doc("Update the status of an order")
          op updateOrderStatus(
            ...Request.Path,
            @body body: Request.Body,
          ): Response.Response;
        }

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
                code: "ORDER_FOUND";
                data: Order;
              }
            }

            namespace Error {
              alias Error = NotFoundError<"ORDER"> | UnexpectedError;
            }

            alias Response = Success.Success | Error.Error;
          }

          @get
          @doc("Get an order by ID")
          op getOrderById(@path id: Request.Path): Response.Response;
        }
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

    @tag("Recipe")
    @route("/recipes")
    namespace Recipe {
      model Recipe {
        id: Id;
        title: string;
        description: string;
        ingredients: {
          quantity: numeric;
          id: string;
        }[];
        instructions: {
          title: string;
          content: string;
        }[];
        video: Media;
        cover_image: Media;
        chef_id: Id;
        created_at: DateTime;
        updated_at: DateTime | null;
      }

      namespace Create {
        namespace Request {
          model Headers {
            @header
            contentType: "multipart/form-data";
          }

          model Body {
            title: HttpPart<string>;
            description: HttpPart<string>;
            ingredients: HttpPart<{
              quantity: numeric;
              id: string;
            }[]>;
            instructions: HttpPart<{
              title: string;
              content: string;
            }[]>;
            video: HttpPart<VideoFile>;
            cover_image: HttpPart<ImageFile>;
          }
        }

        namespace Response {
          namespace Success {
            model Success {
              @statusCode _code: 201;
              code: "RECIPE_CREATED";
              data: Recipe;
            }
          }

          namespace Error {
            alias Error = UnauthorizedError | BadRequestError | UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @post
        @doc("Create a new recipe")
        op createRecipe(
          ...Request.Headers,
          @multipartBody body: Request.Body,
        ): Response.Response;
      }

      namespace List {
        namespace Response {
          namespace Success {
            model Success {
              code: "LIST";
              data: Pagination.Paginated<Recipe>;
            }
          }

          namespace Error {
            alias Error = UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @get
        @doc("List recipes")
        op listRecipes(...Pagination.Query): Response.Response;
      }

      @route("/{id}")
      namespace ById {
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
                code: "RECIPE_FOUND";
                data: Recipe;
              }
            }

            namespace Error {
              alias Error = NotFoundError<"RECIPE"> | UnexpectedError;
            }

            alias Response = Success.Success | Error.Error;
          }

          @get
          @doc("Get a recipe by ID")
          op getRecipeById(...Request.Path): Response.Response;
        }

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
              ...OptionalProperties<Api.Food.Recipe.Create.Request.Body>;
            }
          }

          namespace Response {
            namespace Success {
              model Success {
                @statusCode _code: 200;
                code: "RECIPE_UPDATED";
              }
            }

            namespace Error {
              alias Error =
                | UnauthorizedError
                | NotFoundError<"RECIPE">
                | BadRequestError
                | UnexpectedError;
            }

            alias Response = Success.Success | Error.Error;
          }

          @patch(#{ implicitOptionality: false })
          @doc("Update a recipe by ID")
          op updateRecipeById(
            ...Request.Headers,
            ...Request.Path,
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
                code: "RECIPE_DELETED";
              }
            }

            namespace Error {
              alias Error =
                | NotFoundError<"RECIPE">
                | BadRequestError
                | UnauthorizedError
                | UnexpectedError;
            }

            alias Response = Success.Success | Error.Error;
          }

          @delete
          @doc("Delete a recipe by ID")
          op deleteRecipeById(...Request.Path): Response.Response;
        }
      }
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
          model Success {
            code: "LIST";
            data: Pagination.Paginated<Advertisement>;
          }
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

      @patch(#{ implicitOptionality: false })
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

  @tag("Transaction")
  @route("/transactions")
  namespace Transaction {
    model Transaction {
      id: Id;
      type: "CREDIT" | "DEBIT";
      amount: Price;
      purpose: "TOPUP" | "ORDER";
      created_at: DateTime;
      updated_at: DateTime;
    }

    model NotFoundTransactionError {
      code: "ERR_TRANSACTION_NOT_FOUND";
    }

    model UnexpectedError {
      code: "ERR_UNEXPECTED";
    }

    namespace List {
      namespace Request {
        alias Query = Pagination.Query;
      }

      namespace Response {
        namespace Success {
          model Success {
            code: "LIST";
            data: Pagination.Paginated<Transaction>;
          }
        }

        namespace Error {
          alias Error = UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @get
      @doc("List all transactions")
      op listTransactions(...Request.Query): Response.Response;
    }

    @route("/{id}")
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
            code: "TRANSACTION_FOUND";
            data: Transaction;
          }
        }

        namespace Error {
          alias Error = NotFoundError<"TRANSACTION"> | UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @get
      @doc("Get a transaction by ID")
      op getTransactionById(...Request.Path): Response.Response;
    }
  }

  @tag("Wallet")
  @route("/wallets")
  namespace Wallet {
    model Wallet {
      id: Id;
      user_id: Id;
      balance: string;
      created_at: DateTime;
      updated_at: DateTime | null;
    }

    namespace Get {
      namespace Response {
        namespace Success {
          model Success {
            @statusCode _code: 200;
            code: "WALLET_FOUND";
            wallet: Wallet | null;
          }
        }

        namespace Error {
          alias Error = UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @get
      @doc("Get the active wallet")
      op getActiveWallet(): Response.Response;
    }

    @route("/topup")
    namespace Topup {
      namespace Request {
        model Body {
          @minValue(100)
          amount: Price;
        }
      }

      namespace Response {
        namespace Success {
          model Success {
            @statusCode _code: 200;
            code: "WALLET_TOPUP_REQUEST_SUCCESSFUL";
            data: {
              url: string;
            };
          }
        }

        namespace Error {
          alias Error = BadRequestError | UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @post
      @doc("Top up a user's wallet")
      op topupWallet(@body body: Request.Body): Response.Response;
    }

    @route("/withdraw")
    namespace Withdraw {
      namespace Request {
        model Body {
          amount: Price;
        }
      }

      namespace Response {
        namespace Success {
          model Success {
            @statusCode _code: 200;
            code: "WALLET_WITHDRAWAL_REQUEST_SUCCESSFUL";
          }
        }

        namespace Error {
          @error
          model InsufficientFundsError {
            @statusCode _code: 400;
            code: "ERR_INSUFFICIENT_FUNDS";
          }
          alias Error = InsufficientFundsError | BadRequestError | UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @post
      @doc("Withdraw from a user's wallet")
      op withdrawFromWallet(@body body: Request.Body): Response.Response;
    }
  }

  @tag("Chef")
  @route("/chefs")
  namespace Chef {
    model Chef {
      id: Id;
      name: string;
      niches: string[];
      profile_picture: Media | null;
      rating: numeric;
      likes: numeric;
      dislikes: numeric;
      is_verified: boolean;
      is_banned: boolean;
      user_id: Id;
      created_at: DateTime;
      updated_at: DateTime | null;
    }

    namespace Create {
      namespace Request {
        model Body {
          name: string;
          niches: string[];
        }
      }

      namespace Response {
        namespace Success {
          model Success {
            @statusCode _code: 201;
            code: "CHEF_PROFILE_CREATED";
          }
        }

        namespace Error {
          @error
          model ChefAlreadyExistsError {
            @statusCode _code: 409;
            code: "ERR_CHEF_PROFILE_ALREADY_CREATED";
          }

          alias Error = ChefAlreadyExistsError | BadRequestError | UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @post
      @doc("Create a new chef")
      op createChef(@body body: Request.Body): Response.Response;
    }

    @route("/profile")
    namespace Profile {
      namespace Get {
        namespace Response {
          namespace Success {
            model Success {
              @statusCode _code: 200;
              code: "CHEF_PROFILE_FOUND";
              data: Chef;
            }
          }

          namespace Error {
            alias Error = NotFoundError<"CHEF_PROFILE"> | UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @get
        @doc("Get active chef profile")
        op getChefByProfile(): Response.Response;
      }

      namespace Update {
        namespace Request {
          model Headers {
            @header contentType: "multipart/form-data";
          }

          model Body {
            name?: HttpPart<string>;
            niches?: HttpPart<string[]>;
            profile_picture?: HttpPart<ImageFile>;
          }
        }

        namespace Response {
          namespace Success {
            model Success {
              @statusCode _code: 200;
              code: "CHEF_PROFILE_UPDATED";
              data: Chef;
            }
          }

          namespace Error {
            alias Error = NotFoundError<"CHEF_PROFILE"> | BadRequestError | UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @patch(#{ implicitOptionality: false })
        @doc("Update active chef profile")
        op updateChefByProfile(
          ...Request.Headers,
          @multipartBody body: Request.Body,
        ): Response.Response;
      }
    }

    namespace List {
      namespace Request {
        alias Query = Pagination.Query;
      }

      namespace Response {
        namespace Success {
          model Success {
            code: "LIST";
            data: Pagination.Paginated<Chef>;
          }
        }

        namespace Error {
          alias Error = UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @get
      @doc("List all chefs")
      op listChefs(...Request.Query): Response.Response;
    }

    @route("/{id}")
    namespace ById {
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
              code: "CHEF_PROFILE_FOUND";
              data: Chef;
            }
          }

          namespace Error {
            alias Error = NotFoundError<"CHEF_PROFILE"> | UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @get
        @doc("Get a chef profile by ID")
        op getChefById(...Request.Path): Response.Response;
      }

      @route("/like")
      namespace Like {
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
              code: "CHEF_PROFILE_LIKED";
            }
          }

          namespace Error {
            alias Error = NotFoundError<"CHEF_PROFILE"> | UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @put
        @doc("Like a chef profile by ID")
        op likeChefById(...Request.Path): Response.Response;
      }

      @route("/dislike")
      namespace Dislike {
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
              code: "CHEF_PROFILE_DISLIKED";
            }
          }

          namespace Error {
            alias Error = NotFoundError<"CHEF_PROFILE"> | UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @put
        @doc("Dislike a chef profile by ID")
        op dislikeChefById(...Request.Path): Response.Response;
      }

      @route("/rate")
      namespace Rate {
        namespace Request {
          model Path {
            @path
            id: Id;
          }

          model Body {
            @minValue(1)
            @maxValue(5)
            rating: integer;
          }
        }

        namespace Response {
          namespace Success {
            model Success {
              @statusCode _code: 200;
              code: "CHEF_PROFILE_RATED";
            }
          }

          namespace Error {
            alias Error = NotFoundError<"CHEF_PROFILE"> | UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @put
        @doc("Rate a chef profile by ID")
        op rateChefById(
          ...Request.Path,
          @body body: Request.Body,
        ): Response.Response;
      }
    }
  }

  model Media {
    @example("h93suhw7mzyujf9tbugy")
    public_id: string;

    @example("https://res.cloudinary.com/dyirc2dvg/image/upload/v1747581547/foodhut/h93suhw7mzyujf9tbugy.jpg")
    url: string;
  }

  namespace Pagination {
    model Options {
      page: int64;
      per_page: int64;
    }

    model Meta {
      ...Options;
      total: int64;
    }

    model Paginated<T> {
      data: T[];
      meta: Meta;
    }

    model Query {
      @query
      @minValue(1)
      page?: integer;

      @query
      @minValue(10)
      @maxValue(100)
      per_page?: integer;
    }
  }
}
