import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function exportToCsv(data: any[], filename: string) {
  const headers = ['Tanggal/Waktu', 'Nama Barang', 'Status', 'Jumlah', 'Catatan', 'Proyek', 'Pengawas']
  const csvContent = [
    headers.join(','),
    ...data.map(item => 
      [
        formatDate(item.date),
        `"${item.name}"`,
        item.type.toUpperCase(),
        item.quantity,
        `"${item.notes || ''}"`,
        `"${item.project}"`,
        `"${item.supervisor}"`
      ].join(',')
    )
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}