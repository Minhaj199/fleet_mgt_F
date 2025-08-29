
import * as React from 'react'
import { cn } from '../../lib/utils'
export const Table = ({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => <table className={cn('w-full text-sm', className)} {...props} />
export const THead = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => <thead className={cn('', className)} {...props} />
export const TBody = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody className={cn('', className)} {...props} />
export const TR = ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => <tr className={cn('border-b last:border-0', className)} {...props} />
export const TH = ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => <th className={cn('text-left text-xs font-semibold uppercase text-gray-500 py-2', className)} {...props} />
export const TD = ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => <td className={cn('py-3 align-top', className)} {...props} />
