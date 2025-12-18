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
    return NextResponse.json(
      { error: 'Failed to create project transaction' },
      { status: 500 }
    );
  }
}