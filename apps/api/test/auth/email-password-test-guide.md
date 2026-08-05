# test suit for testing email and password auth

---

test the following endpoints

| Endpoint Path                       |     Method     | Auth Required | Description / Purpose                                     | Key Payload / Query                | Expected Output                    |
| :---------------------------------- | :------------: | :-----------: | :-------------------------------------------------------- | :--------------------------------- | :--------------------------------- |
| `/api/auth/sign-up/email`           |     `POST`     |      No       | Registers a new user account with email credentials.      | `{ email, password, name }`        | User object & Session token/cookie |
| `/api/auth/sign-in/email`           |     `POST`     |      No       | Authenticates user credentials and issues session cookie. | `{ email, password }`              | User object & Session cookie       |
| `/api/auth/sign-out`                |     `POST`     |      Yes      | Invalidates the active session and clears auth cookies.   | None                               | `{ success: true }`                |
| `/api/auth/get-session`             |     `GET`      |   Optional    | Retrieves the active session and user profile data.       | Header Cookie / Bearer             | `{ user, session }` or `null`      |
| `/api/auth/forget-password`         |     `POST`     |      No       | Initiates password reset flow by sending a reset token.   | `{ email, redirectTo? }`           | `{ status: true }`                 |
| `/api/auth/reset-password`          |     `POST`     |      No       | Completes password reset using a valid reset token.       | `{ token, newPassword }`           | `{ status: true }`                 |
| `/api/auth/change-password`         |     `POST`     |      Yes      | Allows logged-in user to update their current password.   | `{ currentPassword, newPassword }` | `{ status: true }`                 |
| `/api/auth/verify-email`            | `GET` / `POST` |      No       | Validates a user's email address via token string.        | `{ token }` / Query `?token=...`   | User record / Redirect response    |
| `/api/auth/send-verification-email` |     `POST`     |      Yes      | Triggers a new verification email to the current user.    | `{ email }`                        | `{ status: true }`                 |
