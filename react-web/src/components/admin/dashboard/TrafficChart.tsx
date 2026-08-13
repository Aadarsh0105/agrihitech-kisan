import React, { useState } from 'react';
import { Card, CardHeader } from '../ui/Card';
import { Tabs } from '../ui/Tabs';
import { trafficSeries } from '../../../data/admin/dashboard';
import { formatNumber } from '../../../utils/admin/format';

const ranges = [
{ key: '30d', label: 'Last 30 days' },
{ key: '90d', label: 'Last 90 days' },
{ key: '12m', label: 'Last 12 months' }];


export function TrafficChart() {
  const [range, setRange] = useState('30d');
  const total = trafficSeries.reduce((sum, point) => sum + point.visitors, 0);
  const maxVisitors = Math.max(...trafficSeries.map((point) => point.visitors));
  const maxViews = Math.max(...trafficSeries.map((point) => point.productViews));

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
      <div className="h-[280px] w-full px-4 pb-4 pt-3">
        <div className="flex h-full flex-col rounded-2xl border border-border bg-muted/20 p-4">
          <div className="mb-3 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Visitors</span>
            <span>Product views</span>
          </div>
          <div className="flex min-h-0 flex-1 items-end gap-2">
            {trafficSeries.map((point) => (
              <div key={point.date} className="flex h-full flex-1 flex-col justify-end gap-1">
                <div className="flex flex-1 items-end gap-1">
                  <div
                    className="w-1/2 rounded-t-md bg-primary/80"
                    style={{ height: `${Math.max(8, (point.visitors / maxVisitors) * 100)}%` }}
                    title={`Visitors ${point.visitors}`}
                  />
                  <div
                    className="w-1/2 rounded-t-md bg-info/80"
                    style={{ height: `${Math.max(8, (point.productViews / maxViews) * 100)}%` }}
                    title={`Product views ${point.productViews}`}
                  />
                </div>
                <span className="truncate text-center text-[10px] text-muted-foreground">{point.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>);

}
