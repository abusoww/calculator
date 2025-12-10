# How to Deploy to Vercel

Since this is a static site (HTML/JS/CSS), deploying to Vercel is very simple.

## Option 1: Vercel CLI (Recommended)

You can deploy directly from your terminal.

1.  **Install Vercel CLI** (if you don't have it):
    ```bash
    npm i -g vercel
    ```

2.  **Login**:
    ```bash
    vercel login
    ```

3.  **Deploy**:
    Run this command in the project root:
    ```bash
    vercel
    ```
    - Set up and deploy? **Y**
    - Which scope? (Select your account)
    - Link to existing project? **N**
    - Project name? (Press Enter for default)
    - In which directory is your code located? (Press Enter for `./`)
    - Want to modify these settings? **N**

4.  **Production Deployment**:
    Once you are happy with the preview:
    ```bash
    vercel --prod
    ```

## Option 2: Vercel Dashboard (Git Integration)

1.  Push your code to a GitHub/GitLab/Bitbucket repository.
2.  Go to [vercel.com/new](https://vercel.com/new).
3.  Import your repository.
4.  **Framework Preset**: Select **Other** (since it's plain HTML).
5.  **Root Directory**: Keep as `./`.
6.  Click **Deploy**.

## Configuration (Optional)

If you want specific caching rules or clean URLs, you can create a `vercel.json` file in the root:

```json
{
  "cleanUrls": true,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```
