#!/bin/bash

# This script organizes your React files into the correct folder structure
# Run this in your project root directory

echo "📁 Creating folder structure..."

# Create directories
mkdir -p assets/js/components/tabs
mkdir -p assets/js/components/common  
mkdir -p assets/js/providers
mkdir -p assets/css/components/tabs

echo "✅ Folders created"

echo "📦 Moving files..."

# Main entry point
if [ -f "admin.jsx" ]; then
    mv admin.jsx assets/js/
    echo "  ✓ Moved admin.jsx"
fi

# Providers
if [ -f "SettingsProvider.jsx" ]; then
    mv SettingsProvider.jsx assets/js/providers/
    echo "  ✓ Moved SettingsProvider.jsx"
fi

# Main components
for file in Dashboard.jsx TabNavigation.jsx TabContent.jsx LoadingSpinner.jsx; do
    if [ -f "$file" ]; then
        mv "$file" assets/js/components/
        echo "  ✓ Moved $file"
    fi
done

# Tab components
for file in GeneralMeta.jsx SocialMedia.jsx SchemaMarkup.jsx Breadcrumbs.jsx SitemapRobots.jsx TrackingTags.jsx; do
    if [ -f "$file" ]; then
        mv "$file" assets/js/components/tabs/
        echo "  ✓ Moved $file"
    fi
done

# Common components
if [ -f "ServiceCatalogInput.jsx" ]; then
    mv ServiceCatalogInput.jsx assets/js/components/common/
    echo "  ✓ Moved ServiceCatalogInput.jsx"
fi

# Data files
for file in schemaTypes.js socialFields.js; do
    if [ -f "$file" ]; then
        mv "$file" assets/js/components/tabs/
        echo "  ✓ Moved $file"
    fi
done

# SCSS files
for file in *.scss; do
    if [ -f "$file" ]; then
        mv "$file" assets/css/components/tabs/
        echo "  ✓ Moved $file"
    fi
done

echo ""
echo "🎉 File organization complete!"
echo ""
echo "Your structure should now look like:"
echo "assets/"
echo "├── js/"
echo "│   ├── admin.jsx"
echo "│   ├── components/"
echo "│   │   ├── common/"
echo "│   │   │   └── ServiceCatalogInput.jsx"
echo "│   │   ├── tabs/"
echo "│   │   │   ├── GeneralMeta.jsx"
echo "│   │   │   ├── SocialMedia.jsx"
echo "│   │   │   ├── SchemaMarkup.jsx"
echo "│   │   │   ├── Breadcrumbs.jsx"
echo "│   │   │   ├── SitemapRobots.jsx"
echo "│   │   │   ├── TrackingTags.jsx"
echo "│   │   │   ├── schemaTypes.js"
echo "│   │   │   └── socialFields.js"
echo "│   │   ├── Dashboard.jsx"
echo "│   │   ├── TabNavigation.jsx"
echo "│   │   ├── TabContent.jsx"
echo "│   │   └── LoadingSpinner.jsx"
echo "│   └── providers/"
echo "│       └── SettingsProvider.jsx"
echo "└── css/"
echo "    └── components/"
echo "        └── tabs/"
echo "            └── *.scss files"
echo ""
echo "Now you can run: npm run build"