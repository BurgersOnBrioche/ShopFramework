# ShopFramework

This is the source for the javascript that is embedded into the shopframework.com shopify site.


## Requirements

1. Node 6+

## Setup

    $ npm install

## Running Locally

    $ npm start

## Deploy

    $ npm run deploy

## Shopify integration

Currently, this is integrated in the `custombar.liquid` snippet, which is referenced by `product.skimmbassador.liquid`

It makes the following assumptions:

1. `window.baseUrl` will contain the base url of this script
1. A hidden input field will send through to shopify with id `custombar-custom-info`
