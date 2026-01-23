# SEOLite

> **The world's lightest full-featured SEO plugin.** 50x smaller than competitors, with a modern React admin interface.

[![WordPress](https://img.shields.io/badge/WordPress-5.0%2B-blue.svg)](https://wordpress.org)
[![PHP](https://img.shields.io/badge/PHP-7.4%2B-purple.svg)](https://php.net)
[![License](https://img.shields.io/badge/License-GPL%20v2-green.svg)](LICENSE)
[![Size](https://img.shields.io/badge/Size-414KB-brightgreen.svg)](#why-lightweight-matters)

## 🚀 Why This Plugin Exists

After years of dealing with bloated SEO plugins that slow down websites and clutter admin interfaces, I built what I actually wanted: **a lightweight, powerful SEO plugin that just works.**

## ⚡ The Size Difference is Staggering

| Plugin         | Size       | Difference        |
| -------------- | ---------- | ----------------- |
| **WP SEOLit**  | **414 KB** | ✅ **Baseline**   |
| Yoast SEO      | ~20 MB     | 🐌 **48x larger** |
| RankMath       | ~12 MB     | 🐌 **29x larger** |
| All in One SEO | ~15 MB     | 🐌 **36x larger** |
| SEOPress       | ~8 MB      | 🐌 **19x larger** |

_Our entire plugin is smaller than most competitors' CSS files._

## ✨ Features

### 🏷️ Essential Meta Tags

- Page titles and descriptions
- Robots directives (index/noindex, follow/nofollow)
- Canonical URLs and hreflang
- Character encoding and viewport
- Author, copyright, and custom meta tags

### 📱 Social Media Optimization

- Open Graph tags for Facebook, LinkedIn
- Twitter Cards for better tweet previews
- Custom social images and descriptions
- Platform-specific optimizations

### 📊 Schema Markup (JSON-LD)

- Organization, LocalBusiness, Restaurant, Store
- Article, NewsArticle, Product, Service
- Person, Event, Recipe, Book, Course
- Website and WebPage structured data
- Custom service catalogs and offerings

### 📈 Analytics & Tracking

- Google Analytics 4 and Universal Analytics
- Google Tag Manager integration
- Facebook Pixel, Microsoft Clarity, Hotjar
- LinkedIn Insight Tag, TikTok Pixel
- Custom head and body scripts
- Site verification codes (Google, Bing, etc.)

### 🍞 Advanced Features

- Breadcrumb structured data
- XML sitemap generation
- robot.stxt generation
- Smart settings inheritance (Global → Page-specific)
- SEO status indicators in WordPress admin pages

## 🎯 What Makes This Different

### **WordPress Integration That Actually Makes Sense**

- 🟢 SEO status visible right in your Pages list
- ✏️ One-click editing from any page
- 🎯 Context-aware settings inheritance
- 🚀 No hunting through complex menus

### **Built for Performance**

- ⚡ Loads in milliseconds, not seconds
- 💾 Minimal memory footprint
- 🏃‍♂️ Won't slow down your site
- 📱 Mobile-friendly admin interface

### **Developer-Friendly**

- 🧹 Clean, readable code
- 🔧 Modern React components
- 📝 Extensive documentation
- 🐛 Easy to debug and extend

## 📸 Screenshots

### WordPress Admin Integration

_See SEO status right where you work - no more hunting through menus_

### Modern React Dashboard

_Clean, intuitive interface that doesn't overwhelm_

### Real-Time Code Preview

_See exactly what's being output to your pages_

## 🚀 Installation

### Option 1: Download Release

1. Download the latest release ZIP from [Releases](../../releases)
2. Go to **Plugins → Add New → Upload Plugin** in WordPress
3. Upload the ZIP file and activate

### Option 2: WordPress.org (Coming Soon)

_Plugin is under review for the WordPress.org directory_

## ⚙️ Development

### Prerequisites

- Node.js 16+
- PHP 7.4+
- WordPress 5.0+

```

## 🔧 Configuration

### Global Settings

Set defaults that apply to all pages unless overridden:

- Site-wide meta tags
- Default social images
- Analytics tracking codes
- Schema organisation details

### Page-Specific Overrides

Customize SEO for individual pages:

- Unique titles and descriptions
- Custom social media content
- Page-specific schema markup
- Targeted tracking codes

### Smart Inheritance

The plugin uses cascading settings (like SCSS):
Throughout I have stuck with modules to avoid specificity issues related to broad selectors over a variety of themes.

- **Global settings** provide defaults
- **Page-specific settings** override globals
- **Visual indicators** show what's inherited vs. custom

## 🎯 Use Cases

### ✅ Perfect For:

- **Performance-focused websites** that can't afford 20MB plugins
- **Developers** who want clean, maintainable (and changeable) SEO code
- **Content creators** who need SEO tools where they work
- **Modern WordPress sites** that value clean admin interfaces
- **Anyone frustrated** with bloated SEO plugins

### ❌ Not For:

- Users who want 100+ features they'll never use
- Sites that require extensive SEO automation
- Users who do not want to type anything...

## 🤝 Contributing

Contributions are welcome! This plugin focuses on **essential SEO features done well** rather than kitchen-sink functionality.

### Contribution Guidelines:

- 🎯 **Focus on core SEO needs**
- ⚡ **Keep it lightweight** (performance first)
- 🧹 **Follow WordPress coding standards**
- 📝 **Update documentation**
- 🔍 **Test thoroughly**

## 📋 Roadmap

### ✅ Version 1.0 (Current)

- Essential meta tags
- Social media optimization
- Schema markup
- Analytics integration
- WordPress admin integration

### 🔮 Future Versions

- Simple redirect management
- Basic site audit features
- Performance optimizations
- Do you want AI? It's a lot of bloat, perhaps another plugin extension is better?

_Note: We'll never bloat this plugin. Each feature must justify its existence._

## 🐛 Support

- **Issues**: [GitHub Issues](../../issues)
- **Documentation**: [Wiki](../../wiki)
- **Discussions**: [GitHub Discussions](../../discussions)

## 📜 License

GPL v2 or later. See [LICENSE](LICENSE) file.

---

**⚡ Finally, an SEO plugin that doesn't suck.**

_Built with ❤️ and 🧠 for the WordPress community._
```
