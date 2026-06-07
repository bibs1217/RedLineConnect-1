import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const make      = searchParams.get('make')      ?? ''
  const model     = searchParams.get('model')     ?? ''
  const yearMin   = searchParams.get('year_min')  ?? ''
  const yearMax   = searchParams.get('year_max')  ?? ''
  const condition = searchParams.get('condition') ?? ''
  const type      = searchParams.get('type')      ?? ''
  const priceMin  = searchParams.get('price_min') ?? ''
  const priceMax  = searchParams.get('price_max') ?? ''
  const zip       = searchParams.get('zip')       ?? ''
  const radius    = searchParams.get('radius')    ?? '50'

  const appId = process.env.EBAY_APP_ID
  if (!appId) return NextResponse.json({ items: [] })

  const keywords = [make, model, type, 'golf cart'].filter(Boolean).join(' ')

  const params = new URLSearchParams({
    'OPERATION-NAME': 'findItemsAdvanced',
    'SERVICE-VERSION': '1.0.0',
    'SECURITY-APPNAME': appId,
    'RESPONSE-DATA-FORMAT': 'JSON',
    'REST-PAYLOAD': '',
    'keywords': keywords,
    'categoryId': '47254',
    'paginationInput.entriesPerPage': '24',
    'outputSelector(0)': 'PictureURLSuperSize',
    'outputSelector(1)': 'SellerInfo',
  })

  if (condition === 'new') params.set('itemFilter(0).name', 'Condition')
  if (condition === 'new') params.set('itemFilter(0).value', 'New')
  if (condition === 'used') { params.set('itemFilter(0).name', 'Condition'); params.set('itemFilter(0).value', 'Used') }

  let filterIdx = condition ? 1 : 0
  if (priceMin) { params.set(`itemFilter(${filterIdx}).name`, 'MinPrice'); params.set(`itemFilter(${filterIdx}).value`, priceMin); filterIdx++ }
  if (priceMax) { params.set(`itemFilter(${filterIdx}).name`, 'MaxPrice'); params.set(`itemFilter(${filterIdx}).value`, priceMax); filterIdx++ }

  if (zip) { params.set('buyerPostalCode', zip); params.set(`itemFilter(${filterIdx}).name`, 'MaxDistance'); params.set(`itemFilter(${filterIdx}).value`, radius) }

  try {
    const res = await fetch(`https://svcs.ebay.com/services/search/FindingService/v1?${params}`)
    const data = await res.json()
    const items = data?.findItemsAdvancedResponse?.[0]?.searchResult?.[0]?.item ?? []

    const results = items.map((item: Record<string, unknown[]>) => ({
      id:        (item.itemId as string[])?.[0],
      title:     (item.title as string[])?.[0],
      price:     (item.sellingStatus as Record<string, unknown[]>[])?.[0]?.convertedCurrentPrice?.[0],
      url:       (item.viewItemURL as string[])?.[0],
      image:     (item.galleryURL as string[])?.[0],
      condition: (item.condition as Record<string, unknown[]>[])?.[0]?.conditionDisplayName?.[0],
      location:  (item.location as string[])?.[0],
      endTime:   (item.listingInfo as Record<string, unknown[]>[])?.[0]?.endTime?.[0],
    }))

    return NextResponse.json({ items: results })
  } catch {
    return NextResponse.json({ items: [] })
  }
}
