import React from 'react';
import { Badge } from './ui/badge';
import { BadgeDollarSign, BaggageClaim, BathIcon, BedIcon, CircleDollarSign, DollarSign, ExternalLinkIcon, Icon, LinkIcon, LocateIcon, LocationEdit, PackageCheck, Popsicle, ShieldAlertIcon, ThumbsDown, ThumbsUp, TypeIcon, type IconNode, } from "lucide-react"
import { Button } from "./ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "./ui/item"


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

     {/*
      {property_details ? (
        <div className='flex flex-col gap-2'>
          <ItemIcon icon={LinkIcon} title='URL' description={property_details.url ?? 'No URL found'} />
          <ItemIcon icon={LocateIcon} title='Location' description={property_details.location ?? 'No location found'} />
          <ItemIcon icon={CircleDollarSign} title='Price' description={property_details.price ?? 'No price found'} />
          <ItemIcon icon={BedIcon} title='Bedrooms' description={(property_details.beds || property_details.bedrooms) ?? 'No bedrooms found'} />
          <ItemIcon icon={BathIcon} title='Bathrooms' description={(property_details.baths || property_details.bathrooms) ?? 'No bathrooms found'} />
          <ItemIcon icon={TypeIcon} title='Property Type' description={property_details.property_type ?? 'No property type found'} />
          <ItemIcon icon={Popsicle} title='Features' description={(property_details.special_features || property_details.features).join(', ') ?? 'No features found'} />
        </div>
      ) : (
        <p>No property details found.</p>
      )}


      {ai_summary && (
        <div className='flex flex-col gap-2'>
          <h3 className='text-lg font-bold'>Propa Summary:</h3>
          <ItemIcon icon={ThumbsUp} title='Pros' description={(ai_summary.pros || []).join(', ') ?? 'No pros found'} />
          <ItemIcon icon={ThumbsDown} title='Cons' description={(ai_summary.cons || []).join(', ') ?? 'No cons found'} />
          <ItemIcon icon={PackageCheck} title='Investment Potential' description={(ai_summary.investment_potential || []).join(', ') ?? 'No investment potential found'} />

        </div>
      )}

  {comparable_sales ? (
        <div>
          <ItemIcon icon={BaggageClaim} title='Comparable Sales' description={comparable_sales} />
        </div>
      ) : (
        <p>No comparable sales found.</p>
      )}

      {rental_yield_estimates ? (
        <div>
          <ItemIcon icon={BadgeDollarSign} title='Rental Yield Estimates' description={rental_yield_estimates} />
        </div>
        ) : (
          <p>No rental yield estimates found.</p>
        )}

      {price_per_square_foot_analytics ?
        <ItemIcon title='Price Per Square Foot Analytics' description={price_per_square_foot_analytics} icon={CircleDollarSign} />
        : 
          <p>No price per square foot analytics found.</p>
      } */}
    </div>
  );
};


interface ItemProps {
  icon: React.ElementType
  title: string
  description: string
  action_icon?: React.ElementType
}
export function ItemIcon({ icon, title, description, action_icon }: ItemProps) {
  const Icon = icon || ShieldAlertIcon;
  const ActionIcon = action_icon || ExternalLinkIcon;

  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <Item variant="outline">
        <ItemMedia variant="icon">
          <Icon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{title ?? `No ${title} found`}</ItemTitle>
          <ItemDescription>
            {description ?? `No ${description} found`}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          {action_icon && <ActionIcon />}
        </ItemActions>
      </Item>
    </div>
  )
}


