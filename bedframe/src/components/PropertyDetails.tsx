import React, { useState } from 'react';
import { BadgeDollarSign, BaggageClaim, BathIcon, BedIcon, CircleDollarSign, ExternalLinkIcon, FolderArchive, LinkIcon, LocateIcon, PackageCheck, Popsicle, Scale, Scale3D, Scale3d, ScaleIcon, ShieldAlertIcon, ThumbsDown, ThumbsUp, TypeIcon, } from "lucide-react"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "./ui/item"
import { loading } from 'happy-dom/lib/PropertySymbol.js';
import { Button } from './ui/button';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from './ui/empty';
import { Spinner } from './ui/spinner';


interface PropertyDetailsProps {
  data: any;
}

export const PropertyDetails = ({ data }: PropertyDetailsProps) => {
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  console.log({ data })
  const analyzePage = async () => {
    setLoading(true)

    // Step 1: Get data from active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: () => ({
        url: window.location.href,
        title: document.title,
        content: document.body.innerText.slice(0, 2000)
      })
    })

    const pageData = results[0].result
    // const analysis = await generateFormattedData(`Analyze the property details in the following text and give the comparable_sales and rental_estimates for other comparable properties:${data}`)

    const analysis = "Hello analysis"
    console.log({ analysis })
    setAnalysis(analysis)

    try {
      // const res = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze`, {
      const res = await fetch(`http://localhost:4000/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageData)
      })
      const response = await res.json()
      data = response


    } catch (err) {
      console.error("Error sending data:", err)
      data = { error: "Failed to reach backend: " + err }
    } finally {
      setLoading(false)
    }
  }
  if (!data) {
    return <div>
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderArchive />
          </EmptyMedia>
          <EmptyTitle>Property Details Not Fetched</EmptyTitle>
          <EmptyDescription>
            Analyze the property details on this page to get summary and insights, comparable sales and rental estimates.

          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent >
          <div className="flex gap-2">

            <Button onClick={analyzePage} disabled={loading} size="sm">
              {loading ? "Analyzing..." : "Analyze page"}
            </Button>
            <Button disabled={loading} variant="outline" size="sm">
              Add to CRM
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>;
  }

  const { property_details, ai_summary, comparable_sales, rental_yield_estimates, price_per_square_foot_analytics } = data ?? {};

  console.log({ property_details, ai_summary, comparable_sales, rental_yield_estimates, price_per_square_foot_analytics })

  return (
    <div className="w-full  overflow-y-auto gap-2">
      {data ? (
        <pre className="my-3 p-2 border rounded bg-gray-50 max-w-[360px] overflow-y-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <Button disabled size="sm">
          <Spinner />
          Loading Data...
        </Button>

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
*/}
      {comparable_sales ? (
        <div>
          <ItemIcon icon={Scale} title='Comparable Sales' description={comparable_sales} />
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
        <ItemIcon title='Price Per Square Foot Analytics' description={price_per_square_foot_analytics} icon={Scale3D} />
        :
        <p>No price per square foot analytics found.</p>
      }
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
    <div className="flex w-full max-w-lg flex-col gap-6 my-2">
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


