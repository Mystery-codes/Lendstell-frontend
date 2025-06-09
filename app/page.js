"use client"

import { useState, useEffect } from "react"
import { ConnectWallet } from "@/components/connect-wallet"
import { MarketStats } from "@/components/market-stats"
import { AssetTable } from "@/components/asset-table"
import { useWalletContext } from "@/context/wallet-context"
import { fetchAssets } from "@/lib/api"
import { useRouter } from "next/navigation"
import type { Asset } from "@/lib/api"

export default function Dashboard() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const { connected } = useWalletContext()
  const router = useRouter()

  useEffect(() => {
    const getAssets = async () => {
      try {
        const data = await fetchAssets()
        setAssets(data)
      } catch (error) {
        console.error("Failed to fetch assets:", error)
      } finally {
        setLoading(false)
      }
    }

    getAssets()
  }, [])

  const handleAssetAction = (action: string, asset: Asset) => {
    if (!connected) {
      return
    }

    router.push(/actions?type=${action}&asset=${asset.id})
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of Lendstell lending protocol</p>
        </div>
        {!connected && <ConnectWallet />}
      </div>

      <MarketStats />

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Markets</h2>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <AssetTable assets={assets} onAction={handleAssetAction} />
        )}
      </div>
    </div>
  )
}