import React, { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { Card, CardHeader } from '../ui/Card';
import { Tabs } from '../ui/Tabs';
import { trafficSeries } from '../../data/dashboard';
import { formatNumber } from '../../utils/format';

const ranges = [
{ key: '30d', label: 'Last 30 days' },
{ key: '90d', label: 'Last 90 days' },
{ key: '12m', label: 'Last 12 months' }];


export function TrafficChart() {
  const [range, setRange] = useState('30d');
  const total = trafficSeries.reduce((sum, point) => sum + point.visitors, 0);

  return (
    <Card>
      <CardHeader
        title="Traffic overview"
        description={`${formatNumber(total)} visitors · ${formatNumber(
          trafficSeries.reduce((s, p) => s + p.productViews, 0)
        )} product views`} />
      
      <div className="px-3 pt-2">
        <Tabs
          idPrefix="traffic"
          items={ranges}
          value={range}
          onChange={setRange}
          className="border-b-0" />
        
      </div>
      <div className="h-[280px] w-full px-2 pb-4 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trafficSeries} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="visitorsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.22} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="productsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--info))" stopOpacity={0.18} />
                <stop offset="100%" stopColor="hsl(var(--info))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false} />
            
            <YAxis
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
              width={56} />
            
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--elevated))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 8,
                fontSize: 12,
                color: 'hsl(var(--foreground))'
              }} />
            
            <Area
              type="monotone"
              dataKey="productViews"
              name="Product views"
              stroke="hsl(var(--info))"
              strokeWidth={2}
              fill="url(#productsFill)" />
            
            <Area
              type="monotone"
              dataKey="visitors"
              name="Visitors"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#visitorsFill)" />
            
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>);

}