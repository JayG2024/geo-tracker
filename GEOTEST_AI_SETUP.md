# 🌐 Setting Up geotest.ai - Complete Guide

## Step 1: Add Domain to Vercel

### In Vercel Dashboard:
1. Go to your project: https://vercel.com/dashboard
2. Select `geo-tracker-deployment`
3. Click on **Settings** → **Domains**
4. Click **Add Domain**
5. Enter: `geotest.ai`
6. Click **Add**

Vercel will show you DNS records to add.

## Step 2: Configure DNS (Where You Bought Domain)

### If using Namecheap:
Add these DNS records:
```
Type: A
Name: @
Value: 76.76.21.21
TTL: Automatic

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Automatic
```

### If using GoDaddy:
```
Type: A
Name: @
Points to: 76.76.21.21
TTL: 600

Type: CNAME
Name: www
Points to: cname.vercel-dns.com
TTL: 600
```

### If using Cloudflare:
```
Type: A
Name: @
Content: 76.76.21.21
Proxy: OFF (DNS Only)

Type: CNAME
Name: www
Target: cname.vercel-dns.com
Proxy: OFF (DNS Only)
```

### If using Google Domains:
```
Type: A
Name: @
Data: 76.76.21.21
TTL: Default

Type: CNAME
Name: www
Data: cname.vercel-dns.com
TTL: Default
```

## Step 3: Update Vercel Configuration

### Add both domain variations:
1. `geotest.ai` (apex domain)
2. `www.geotest.ai` (www subdomain)

### Set Primary Domain:
- Make `geotest.ai` the primary domain
- This ensures clean URLs without www

## Step 4: Wait for DNS Propagation

- Usually takes 5-30 minutes
- Can take up to 48 hours in rare cases
- Check status at: https://dnschecker.org/#A/geotest.ai

## Step 5: Verify SSL Certificate

Vercel automatically provisions SSL certificates. Check:
- ✅ https://geotest.ai should work
- ✅ https://www.geotest.ai should redirect to geotest.ai
- ✅ http:// versions should redirect to https://

## Step 6: Update App Configuration

### Environment Variables to Update:
Add this to Vercel environment variables:
```
VITE_APP_URL=https://geotest.ai
```

### Update any hardcoded references:
- Change any mentions of geo-tracker-deployment.vercel.app
- Update to geotest.ai

## 🎯 Quick Setup (Most Common - Namecheap)

If you bought from Namecheap, do this:
1. Log into Namecheap
2. Go to Domain List → Manage for geotest.ai
3. Click "Advanced DNS"
4. Delete all existing records
5. Add:
   ```
   A Record    @     76.76.21.21
   CNAME       www   cname.vercel-dns.com
   ```
6. Save changes

## 🔍 Troubleshooting

### Domain not working after 30 minutes?
1. Check DNS at: https://dnschecker.org
2. In Vercel, click "Refresh" next to domain
3. Make sure DNS proxy is OFF if using Cloudflare

### SSL Error?
- Vercel auto-provisions SSL
- Click "Renew Certificate" in Vercel domains

### Wrong redirect?
- Set primary domain in Vercel
- Clear browser cache

## 📱 Final Checklist

- [ ] Domain added to Vercel
- [ ] DNS records configured
- [ ] SSL working (https://)
- [ ] www redirects to apex domain
- [ ] Site loads at geotest.ai

---

**Need Help?**
- Where did you buy the domain? (Namecheap, GoDaddy, etc.)
- I can provide exact steps for your registrar

**Estimated Time**: 5-30 minutes for DNS to propagate