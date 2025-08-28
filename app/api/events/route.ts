import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  const events = await prisma.usageEvent.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(events);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, accountName, functionUsed, salesforceOpportunityId, contentEdits } = body;

    if (!userId || !accountName || !functionUsed) {
      return NextResponse.json(
        { error: 'userId, accountName, and functionUsed are required' },
        { status: 400 },
      );
    }

    const event = await prisma.usageEvent.create({
      data: {
        userId,
        accountName,
        functionUsed,
        salesforceOpportunityId: salesforceOpportunityId ?? null,
        contentEdits: contentEdits ?? null,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown error' }, { status: 500 });
  }
}
