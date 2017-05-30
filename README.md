# ShopFramework

This is the source for the javascript that is embedded into the shopframework.com shopify site.


## Setup

    $ npm install -g gh-pages http-server

## Running Locally

    $ http-server -p 8000 --cors

## Deploy

    $ gh-pages -d .

## Shopify integration

Currently, this is integrated in the `custombar.liquid` snippet, which is referenced by `product.skimmbassador.liquid`

It makes the following assumptions:

1. `window.baseUrl` will contain the base url of this script
1. A hidden input field will send through to shopify with id `custombar-custom-info`
