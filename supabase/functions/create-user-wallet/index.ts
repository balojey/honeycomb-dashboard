
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Connection, Keypair, LAMPORTS_PER_SOL } from "https://esm.sh/@solana/web3.js@1.73.0"

const rpcUrl = Deno.env.get("RPC_URL")

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { user_id } = await req.json()

    if (!user_id) {
      throw new Error("user_id is required")
    }

    const connection = new Connection(rpcUrl, "confirmed")
    const keypair = Keypair.generate()
    const publicKey = keypair.publicKey
    const secretKey = keypair.secretKey

    // Airdrop 1000 SOL
    const airdropSignature = await connection.requestAirdrop(
      publicKey,
      1000 * LAMPORTS_PER_SOL
    )
    await connection.confirmTransaction(airdropSignature)

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    )

    const { data, error } = await supabase
      .from("wallets")
      .insert({
        user_id,
        public_key: publicKey.toBase58(),
        secret_key: JSON.stringify(Array.from(secretKey)),
      })
      .select()

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({
        publicKey: publicKey.toBase58(),
        message: "Wallet created and funded successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    })
  }
})
