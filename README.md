# Shopgate Connect - Chatchamp Wizard Extension

This extension provides an integration of the [Chatchamp](https://www.chatchamp.com/) recommendation wizard. It adds a new route to Engage (`/chatchamp-wizard/wizard-id`) that can be used to open the different wizards that are configured inside the "Chatchamp App".

## Configuration

The followings settings can be configured:

### customerId (string) - required

The `customerId` is used for authentication against the Chatchamp API.

### productPagePattern (string) - required

The last step of the Chatchamp wizard shows a list o recommended product. When users click on those products they are usually redirected to a product details page inside the desktop webshop.
Since the extension is supposed to open products within "Engage", it needs to know about the pattern of the desktop URLs, so that it can decode product identifiers which can be used to perform a product search.

#### Example
Example desktop product page url: `https://my-nice-shop.com/product/seo-product-title/pr0duct-number`
Corresponding page pattern: `https://my-nice-shop.com/product/:productName/:productNumber`

### productURLSearchParam (string)
Default value: `productNumber`

Indicates the path param of the product page url which is used to perform a product search.

### pageTitleMapping (array)

The pageTitleMapping setting allows to configure page titles for each wizard. When a wizard is opened which is not included inside the mapping, the title will be empty.

```json
[{
  "wizardId": "wizard-one",
  "title": "Page Title Wizard One"
}, {
  "wizardId": "wizard-tow",
  "title": "Page Title Wizard Two"
}]
```

### iFrameURL
Since the Chatchamp wizard does not work for SPAs right now, the integration is implemented via an iFrame that loads a static HTML document with the necessary code. By default this document is provided by Shopgate and no additional configuration is required.

This parameter allows to replace the document with a custom implementation. An example document can be fond [here](./frontend/assets/chatchamp-iframe.html).


## About Shopgate

Shopgate is the leading mobile commerce platform.

Shopgate offers everything online retailers need to be successful in mobile. Our leading
software-as-a-service (SaaS) enables online stores to easily create, maintain and optimize native
apps and mobile websites for the iPhone, iPad, Android smartphones and tablets.


## License

Shopgate Cloud - Extension Boilerplate is available under the Apache License, Version 2.0.

See the [LICENSE](./LICENSE) file for more information.
