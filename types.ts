
export type EquipmentStatus = 'pending' | 'in_repair' | 'ready' | 'delivered';

export interface ServiceOrder {
  id: string;
  orderNumber: string;
  clientName: string;
  clientContact: string;
  equipmentType: string;
  serialNumber: string;
  hasDefect: boolean;
  defectType: string;
  entryDate: string;
  receiverEmployee: string;
  serviceValue: number;
  returnDate: string;
  signature: string; // Base64 data URL
  status: EquipmentStatus;
  createdAt: string;
}

export interface FormData {
  clientName: string;
  clientContact: string;
  equipmentType: string;
  serialNumber: string;
  hasDefect: boolean;
  defectType: string;
  entryDate: string;
  receiverEmployee: string;
  serviceValue: string;
  returnDate: string;
}
