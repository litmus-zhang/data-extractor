const PromptResponseSchema = {
  "type": "object",
  "properties": {
    "property_details": {
      "type": "object",
      "properties": {
        "url": {
          "type": "string"
        },
        "location": {
          "type": "string"
        },
        "latitude": {
          "type": "number"
        },
        "longitude": {
          "type": "number"
        },
        "price": {
          "type": "string"
        },
        "beds": {
          "type": "number"
        },
        "bedrooms": {
          "type": "number"
        },
        "baths": {
          "type": "number"
        },
        "bathrooms": {
          "type": "number"
        },
        "property_type": {
          "type": "string"
        },
        "features": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "special_features": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },
    "ai_summary": {
      "type": "object",
      "properties": {
        "pros": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "cons": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "investment_potential": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },
    "comparable_sales": {
      "type": "array",
      "maxItems": 3,
      "items": {
        "type": "string"
      }
    },
    "rental_yield_estimates": {
      "type": "string"
    },
    "price_per_square_foot_analytics": {
      "type": "string"
    }
  },
  "required": [
    "comparable_sales",
    "rental_yield_estimates",
    "price_per_square_foot_analytics",
    "ai_summary",
    "property_details"
  ],
  "additionalProperties": false
}


export {PromptResponseSchema}