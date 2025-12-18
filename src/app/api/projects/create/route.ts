import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/utils/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      authorityPublicKey, 
      payerPublicKey, 
      achievements, 
      customDataFields,
      walletAddress 
    } = body;

    // Validate required fields
    if (!name || !authorityPublicKey || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: name, authorityPublicKey, walletAddress' },
        { status: 400 }
      );
    }
    console.log(`{${name} ${authorityPublicKey} ${payerPublicKey}}`)

    // Create the project transaction using Honeycomb client
    const {
      createCreateProjectTransaction: {
        project: projectAddress,
        tx: txResponse,
      },
    } = await client.createCreateProjectTransaction({
      name,
      authority: authorityPublicKey,
      payer: payerPublicKey,
      profileDataConfig: {
        achievements: achievements || [],
        customDataFields: customDataFields || [],
      },
    });
    console.log("here!")

    // Return the transaction response to frontend for signing
    return NextResponse.json({
      success: true,
      projectAddress,
      txResponse,
      // Store these for later use after transaction is signed
      projectData: {
        name,
        authorityPublicKey,
        achievements: achievements || [],
        customDataFields: customDataFields || [],
        walletAddress,
      },
    });

  } catch (error) {
    console.error('Error creating project transaction:', error);
    
    // Check if it's a network error from Honeycomb API
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isNetworkError = errorMessage.includes('Bad Gateway') || errorMessage.includes('Network');
    
    return NextResponse.json(
      { 
        error: 'Failed to create project transaction',
        details: isNetworkError ? 'Honeycomb API is currently unavailable' : errorMessage
      },
      { status: 500 }
    );
  }
}