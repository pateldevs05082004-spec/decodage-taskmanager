# Microsoft Entra ID Setup Guide

This guide walks you through setting up Microsoft Entra ID (formerly Azure Active Directory) authentication for the Decode Age Task Manager using the **free tier**.

## Prerequisites

- A Microsoft account (personal or work/school account)
- Access to the Azure Portal (free tier is sufficient)

## Step 1: Create a Free Azure Account

If you don't already have an Azure account:

1. Visit [https://azure.microsoft.com/free/](https://azure.microsoft.com/free/)
2. Click **Start free** or **Try Azure for free**
3. Sign in with your Microsoft account or create a new one
4. Complete the registration process (requires phone verification)
5. You'll receive $200 in credits for 30 days, but Entra ID authentication is **free forever**

## Step 2: Access Microsoft Entra ID

1. Navigate to the [Azure Portal](https://portal.azure.com)
2. Sign in with your Microsoft account
3. In the search bar at the top, type **Microsoft Entra ID** (or **Azure Active Directory**)
4. Click on **Microsoft Entra ID** from the search results
5. You should now see the Entra ID overview page

## Step 3: Register a New Application

1. In the left sidebar of the Entra ID page, click **App registrations**
2. Click **+ New registration** at the top
3. Fill in the application details:
   - **Name**: `Decode Age Task Manager` (or your preferred name)
   - **Supported account types**: Select one of the following:
     - **Accounts in this organizational directory only** (Single tenant) - Recommended for company-internal use
     - **Accounts in any organizational directory** (Multi-tenant) - If you want to support multiple organizations
     - **Accounts in any organizational directory and personal Microsoft accounts** - For broader access
   - **Redirect URI**: 
     - Platform: **Web**
     - URI: `http://localhost:3000/auth/callback` (for local development)
4. Click **Register**

## Step 4: Configure Redirect URIs

After registration, you'll be taken to the app's overview page.

1. In the left sidebar, click **Authentication**
2. Under **Platform configurations**, you should see your Web platform
3. Add additional redirect URIs if needed:
   - For local development: `http://localhost:3000/auth/callback`
   - For production: `https://yourdomain.com/auth/callback` (add this later when deploying)
4. Under **Implicit grant and hybrid flows**, ensure nothing is checked (we're using Authorization Code Flow with PKCE)
5. Under **Allow public client flows**, set to **No**
6. Click **Save** at the top

## Step 5: Collect Application Credentials

### Get Client ID and Tenant ID

1. Go to the **Overview** page of your app registration (left sidebar)
2. Copy the following values:
   - **Application (client) ID**: This is your `ENTRA_CLIENT_ID`
   - **Directory (tenant) ID**: This is your `ENTRA_TENANT_ID`

### Create Client Secret

1. In the left sidebar, click **Certificates & secrets**
2. Click the **Client secrets** tab
3. Click **+ New client secret**
4. Add a description: `Task Manager Backend Secret`
5. Select an expiration period:
   - **180 days (6 months)** - Recommended for development
   - **730 days (24 months)** - For longer-term use
   - **Custom** - Set your own expiration date
   - **Note**: You'll need to create a new secret before it expires
6. Click **Add**
7. **IMPORTANT**: Copy the **Value** immediately - this is your `ENTRA_CLIENT_SECRET`
   - This value will only be shown once and cannot be retrieved later
   - If you lose it, you'll need to create a new client secret

## Step 6: Configure API Permissions (Optional)

For basic authentication, the default permissions are sufficient. However, if you need additional user information:

1. In the left sidebar, click **API permissions**
2. You should see **Microsoft Graph** with **User.Read** permission (delegated)
3. This permission allows the app to read the signed-in user's profile
4. If you need additional permissions (e.g., reading user's email, groups), click **+ Add a permission**
5. For this application, the default **User.Read** permission is sufficient

## Step 7: Configure Environment Variables

1. In your project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in the Entra ID values:
   ```env
   # Microsoft Entra ID Configuration
   ENTRA_CLIENT_ID=your_application_client_id_here
   ENTRA_CLIENT_SECRET=your_client_secret_value_here
   ENTRA_TENANT_ID=your_directory_tenant_id_here
   ENTRA_REDIRECT_URI=http://localhost:3000/auth/callback
   ```

3. Replace the placeholder values with the credentials you collected in Step 5

## Step 8: Verify Configuration

1. Ensure all environment variables are set correctly in your `.env` file
2. The backend configuration module will automatically load these values
3. Start your application and test the authentication flow

## OAuth 2.0 Flow Overview

The application uses the **Authorization Code Flow with PKCE** (Proof Key for Code Exchange):

1. User clicks "Login" in the frontend
2. Frontend redirects to Microsoft Entra ID login page
3. User enters credentials and consents to permissions
4. Entra ID redirects back to your app with an authorization code
5. Backend exchanges the code for an access token and refresh token
6. Backend validates the token and retrieves user information
7. Backend creates a session and returns a JWT to the frontend
8. Frontend stores the JWT and uses it for subsequent API requests

## Security Best Practices

1. **Never commit `.env` files** - The `.gitignore` file already excludes them
2. **Rotate client secrets regularly** - Set reminders before expiration
3. **Use different credentials for production** - Create separate app registrations for dev/staging/prod
4. **Enable multi-factor authentication** - For admin accounts accessing Azure Portal
5. **Monitor sign-in logs** - Check Entra ID sign-in logs for suspicious activity

## Troubleshooting

### "AADSTS50011: The redirect URI specified in the request does not match"
- Verify the redirect URI in your `.env` matches exactly what's configured in Azure Portal
- Check for trailing slashes or http vs https mismatches

### "AADSTS700016: Application not found in the directory"
- Verify your `ENTRA_TENANT_ID` is correct
- Ensure you're using the correct Azure account

### "AADSTS7000215: Invalid client secret provided"
- Your client secret may have expired
- Create a new client secret in Azure Portal and update your `.env` file

### "AADSTS50105: The signed in user is not assigned to a role for the application"
- This occurs if you've enabled user assignment requirement
- Go to **Enterprise applications** > Your app > **Users and groups** > Add users

## Cost Information

- **Microsoft Entra ID Free Tier**: Included with Azure subscription at no cost
- **Features included**:
  - Up to 50,000 objects (users + groups + applications)
  - Single sign-on (SSO) to unlimited cloud apps
  - User and group management
  - OAuth 2.0 authentication
  - Basic security reports
- **No credit card charges** for authentication features used in this application

## Additional Resources

- [Microsoft Entra ID Documentation](https://learn.microsoft.com/en-us/entra/identity/)
- [OAuth 2.0 Authorization Code Flow](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow)
- [Microsoft Identity Platform Best Practices](https://learn.microsoft.com/en-us/entra/identity-platform/identity-platform-integration-checklist)
- [Azure Free Account FAQ](https://azure.microsoft.com/en-us/free/free-account-faq/)

## Next Steps

After completing this setup:
1. Proceed to implement the authentication service in the backend
2. Create the authentication middleware for protecting routes
3. Implement the frontend login flow
4. Test the complete authentication workflow

---

**Note**: This guide uses the free tier of Microsoft Entra ID, which is sufficient for small to medium-sized organizations. If you need advanced features like conditional access, identity protection, or privileged identity management, consider upgrading to Entra ID P1 or P2.
