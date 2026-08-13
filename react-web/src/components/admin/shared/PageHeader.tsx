import React from 'react';
import { motion } from 'framer-motion';

export function PageHeader({
  title,
  description,
  actions




}: {title: string;description?: string;actions?: React.ReactNode;}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-wrap items-start justify-between gap-4">
      
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description ?
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p> :
        null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </motion.div>);

}