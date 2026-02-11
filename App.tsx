
import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Printer, 
  Trash2, 
  ChevronRight, 
  User, 
  Phone, 
  Cpu, 
  Hash, 
  AlertCircle, 
  Calendar, 
  DollarSign 
} from 'lucide-react';
import { ServiceOrder, FormData, EquipmentStatus } from './types';
import SignaturePad from './components/SignaturePad';

const App: React.FC = () => {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [view, setView] = useState<'list' | 'create'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [signature, setSignature] = useState('');
  const [formData, setFormData] = useState<FormData>({
    clientName: '',
    clientContact: '',
    equipmentType: '',
    serialNumber: '',
    hasDefect: true,
    defectType: '',
    entryDate: new Date().toISOString().split('T')[0],
    receiverEmployee: '',
    serviceValue: '',
    returnDate: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('ths_orders');
    if (saved) setOrders(JSON.parse(saved));
  }, []);

  const saveOrders = (newOrders: ServiceOrder[]) => {
    setOrders(newOrders);
    localStorage.setItem('ths_orders', JSON.stringify(newOrders));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateOSNumber = () => {
    const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `OS-${date}-${random}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signature) {
      alert("A assinatura do cliente é obrigatória.");
      return;
    }

    const newOrder: ServiceOrder = {
      id: crypto.randomUUID(),
      orderNumber: generateOSNumber(),
      ...formData,
      serviceValue: parseFloat(formData.serviceValue) || 0,
      signature,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    saveOrders([newOrder, ...orders]);
    setView('list');
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      clientName: '',
      clientContact: '',
      equipmentType: '',
      serialNumber: '',
      hasDefect: true,
      defectType: '',
      entryDate: new Date().toISOString().split('T')[0],
      receiverEmployee: '',
      serviceValue: '',
      returnDate: '',
    });
    setSignature('');
  };

  const deleteOrder = (id: string) => {
    if (window.confirm("Deseja realmente excluir esta Ordem de Serviço?")) {
      saveOrders(orders.filter(o => o.id !== id));
    }
  };

  const filteredOrders = orders.filter(o => 
    o.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <ClipboardList className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">THS TECNOLOGIAS</h1>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Controle de Ativos TI</p>
            </div>
          </div>

          <nav className="flex items-center bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setView('list')}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${view === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Listagem
            </button>
            <button 
              onClick={() => setView('create')}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${view === 'create' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Nova OS
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {view === 'create' ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 animate-in fade-in duration-300">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Plus size={20} className="text-blue-600" />
                Gerar Ordem de Serviço
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cliente */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                    <User size={14} /> Nome do Cliente
                  </label>
                  <input
                    name="clientName"
                    required
                    value={formData.clientName}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Ex: João da Silva"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                    <Phone size={14} /> Contato do Cliente
                  </label>
                  <input
                    name="clientContact"
                    required
                    value={formData.clientContact}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                {/* Equipamento */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                    <Cpu size={14} /> Tipo de Equipamento
                  </label>
                  <input
                    name="equipmentType"
                    required
                    value={formData.equipmentType}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Ex: Notebook, Desktop"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                    <Hash size={14} /> Número de Série
                  </label>
                  <input
                    name="serialNumber"
                    required
                    value={formData.serialNumber}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Ex: SN12345678"
                  />
                </div>

                {/* Defeito */}
                <div className="col-span-full bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-blue-900">O equipamento apresenta defeito?</span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                      <input 
                        type="radio" 
                        checked={formData.hasDefect} 
                        onChange={() => setFormData(p => ({...p, hasDefect: true}))}
                        className="w-4 h-4 text-blue-600" 
                      /> SIM
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                      <input 
                        type="radio" 
                        checked={!formData.hasDefect} 
                        onChange={() => setFormData(p => ({...p, hasDefect: false}))}
                        className="w-4 h-4 text-blue-600" 
                      /> NÃO
                    </label>
                  </div>
                </div>

                <div className="col-span-full space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                    <AlertCircle size={14} /> Tipo de Defeito / Observações
                  </label>
                  <textarea
                    name="defectType"
                    rows={3}
                    value={formData.defectType}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                    placeholder="Descreva detalhadamente o problema ou observações..."
                  />
                </div>

                {/* Datas e Valores */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                    <Calendar size={14} /> Data de Entrada
                  </label>
                  <input
                    type="date"
                    name="entryDate"
                    required
                    value={formData.entryDate}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                    <User size={14} /> Colaborador Recebedor
                  </label>
                  <input
                    name="receiverEmployee"
                    required
                    value={formData.receiverEmployee}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Nome do técnico/colaborador"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                    <DollarSign size={14} /> Valor do Serviço (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="serviceValue"
                    value={formData.serviceValue}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="0,00"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                    <Calendar size={14} /> Previsão de Devolução
                  </label>
                  <input
                    type="date"
                    name="returnDate"
                    value={formData.returnDate}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                {/* Assinatura */}
                <div className="col-span-full space-y-2 pt-4">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                    Assinatura do Cliente
                  </label>
                  <SignaturePad onSave={setSignature} onClear={() => setSignature('')} />
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-blue-200 uppercase tracking-wide flex items-center justify-center gap-2 active:scale-95"
                >
                  Confirmar e Gerar OS
                </button>
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className="px-8 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all uppercase active:scale-95"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* SEARCH AND TOOLS */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar por cliente, S/N ou OS..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <span className="bg-gray-100 px-3 py-1 rounded-full">{filteredOrders.length} Registros</span>
              </div>
            </div>

            {/* LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <div key={order.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden group">
                    <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                      <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase">
                        {order.orderNumber}
                      </span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => window.print()}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Printer size={18} />
                        </button>
                        <button 
                          onClick={() => deleteOrder(order.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 truncate uppercase">{order.clientName}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone size={12} /> {order.clientContact}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Equipamento</p>
                          <p className="font-bold text-gray-700 uppercase truncate">{order.equipmentType}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">S/N</p>
                          <p className="font-bold text-gray-700 truncate">{order.serialNumber}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-2 border-y border-gray-50">
                        <div className="text-center px-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Entrada</p>
                          <p className="font-bold text-gray-600">{new Date(order.entryDate).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div className="w-px h-6 bg-gray-100"></div>
                        <div className="text-center px-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Valor</p>
                          <p className="font-bold text-blue-600">R$ {order.serviceValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Assinatura</p>
                        <div className="h-12 w-full bg-gray-50 rounded-lg border border-gray-100 p-1 flex items-center justify-center">
                          <img src={order.signature} alt="Client Signature" className="h-full object-contain" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-all cursor-pointer">
                      Ver detalhes <ChevronRight className="inline" size={12} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center space-y-4">
                  <div className="bg-white inline-block p-6 rounded-full shadow-inner border border-gray-100">
                    <ClipboardList size={48} className="text-gray-200" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-gray-800">Sem registros</h3>
                    <p className="text-gray-500">Não há ordens de serviço cadastradas ainda.</p>
                  </div>
                  <button 
                    onClick={() => setView('create')}
                    className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-blue-100 hover:scale-105 transition-all"
                  >
                    Criar OS Agora
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 text-center">
        <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">
          © {new Date().getFullYear()} THS TECNOLOGIAS • Qualidade em Manutenção
        </p>
      </footer>
    </div>
  );
};

export default App;
