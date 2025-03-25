## Sub Domain Hosting for Maistro products

```hcl
module "products_funnel_hosting" {
  source = "../../../packages/infra/modules/hosting"
  
  bucket_name          = "maistro-products-funnels-${var.environment}"
  domain_name = "funnels.maistro.website"
  zone_id = "XXXX"

  tags = {
    product = "maistro funnels"
    environment = var.environment
  }
}
```
