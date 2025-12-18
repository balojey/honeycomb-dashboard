import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      projectAddress,
      name,
      authorityPublicKey,
      achievements,
      customDataFields,
      walletAddress,
      transactionSignature
    } = body;

    // Validate required fields
    if (!projectAddress || !name || !authorityPublicKey || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // First, get or create the wallet address record
    let { data: walletData, error: walletError } = await supabase
      .from('wallet_addresses')
      .select('id')
      .eq('address', walletAddress)
      .single();

    if (walletError && walletError.code !== 'PGRST116') {
      console.error('Error fetching wallet:', walletError);
      return NextResponse.json(
        { error: 'Failed to fetch wallet address' },
        { status: 500 }
      );
    }

    // If wallet doesn't exist, create it
    if (!walletData) {
      const { data: newWallet, error: createWalletError } = await supabase
        .from('wallet_addresses')
        .insert({ address: walletAddress })
        .select('id')
        .single();

      if (createWalletError) {
        console.error('Error creating wallet:', createWalletError);
        return NextResponse.json(
          { error: 'Failed to create wallet address' },
          { status: 500 }
        );
      }

      walletData = newWallet;
    }

    // Store the project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        name,
        project_address: projectAddress,
        wallet_address_id: walletData!.id,
        authority_public_key: authorityPublicKey,
        achievements,
        custom_data_fields: customDataFields,
      })
      .select()
      .single();

    if (projectError) {
      console.error('Error storing project:', projectError);
      return NextResponse.json(
        { error: 'Failed to store project' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      project,
      message: 'Project created and stored successfully',
    });

  } catch (error) {
    console.error('Error storing project:', error);
    return NextResponse.json(
      { error: 'Failed to store project' },
      { status: 500 }
    );
  }
}