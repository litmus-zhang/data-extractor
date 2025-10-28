import React from 'react';
import { Badge } from './ui/badge';

interface PropertyDetailsProps {
  data: any;
}

export const PropertyDetails = ({ data }: PropertyDetailsProps) => {
  if (!data) {
    return <div>No property data available.</div>;
  }

  const { property_details, ai_summary, comparable_sales, rental_yield_estimates, price_per_square_foot_analytics } = data ?? {};

  return (
    <div className="h-[500px] w-[400px] flex-col gap-4 p-4 overflow-y-auto">
      <h1>Property Analysis</h1>
      {data ? (
        <pre className="mt-3 p-2 border rounded bg-gray-50 max-w-[400px] overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <p>No data yet...</p>
      )}

      {property_details ? (
        <div >
          <p><strong>URL:</strong> <a href={property_details.url ?? '#'} target="_blank" rel="noopener noreferrer">{property_details.url ?? 'No URL found'}</a></p>
          <p><strong>Location:</strong> {property_details.location ?? 'No location found'}</p>
          <p><strong>Price:</strong> {property_details.price ?? 'No price found'}</p>
          <p><strong>Bedrooms:</strong> {(property_details.beds || property_details.bedrooms) ?? 'No bedrooms found'}</p>
          <p><strong>Bathrooms:</strong> {(property_details.baths || property_details.bathrooms) ?? 'No bathrooms found'}</p>
          <p><strong>Property Type:</strong> {property_details.property_type ?? 'No property type found'}</p>
          <h3>Features:</h3>
          <ul className="flex w-full flex-wrap gap-2">
            {(property_details.special_features || property_details.features).map((feature: string, index: number) => (
              <Badge variant="outline" className="text-sm" key={index}>{feature.toUpperCase()}</Badge>
            )) ?? (
                <Badge key={0}>No features found</Badge>
              )
            }
          </ul>
        </div>
      ) : (
        <p>No property details found.</p>
      )}


      {ai_summary && (
        <div>
          <h2>AI Summary</h2>
          <h3 className='text-lg font-bold'>Pros:</h3>
          <ul>
            {ai_summary.pros ? ai_summary.pros.map((pro: string, index: number) => (
              <li key={index}>{pro}</li>
            )) : (
              <li key={0}>No pros found</li>
            )
            }
          </ul>
          <h3 className='text-lg font-bold'>Cons:</h3>
          <ul>
            {ai_summary.cons ? ai_summary.cons.map((con: string, index: number) => (
              <li key={index}>{con}</li>
            )) : (
              <li key={0}>No cons found</li>
            )
            }
          </ul>
          <p><strong>Investment Potential:</strong> {ai_summary.investment_potential ? ai_summary.investment_potential : 'No investment potential found'}</p>
        </div>
      )}

      {comparable_sales ? (
        <div>
          <h2>Comparable Sales</h2>
          <p>{comparable_sales}</p>
        </div>
      ) : (
        <p>No comparable sales found.</p>
      )}

      {rental_yield_estimates ? (
        <div>
          <h2>Rental Yield Estimates</h2>
          <p>{rental_yield_estimates}</p>
        </div>
      ) : (
        <p>No rental yield estimates found.</p>
      )}

      {price_per_square_foot_analytics ? (
        <div>
          <h2>Price Per Square Foot Analytics</h2>
          <p>{price_per_square_foot_analytics}</p>
        </div>
      ) : (
        <p>No price per square foot analytics found.</p>
      )}
    </div>
  );
};

