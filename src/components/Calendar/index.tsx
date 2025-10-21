import { useState } from "react";
import { useGetEventsQuery, useCreateEventMutation, useDeleteEventMutation } from "../../services/eventsApi";
import { useUpdateFaqMutation } from "../../services/faqsApi";

export default function Calendar() {
// ✅ USAR RTK QUERY ao invés de AsyncThunk
const { data: events, isLoading: eventsisLoading, error: eventIs, refetch: eventRefetch } = useGetEventsQuery();
const [updateEvent, { isLoading: eventIsUpdating }] = useUpdateFaqMutation();
const [createEvent] = useCreateEventMutation();
const [deleteEvent] = useDeleteEventMutation(); 
const [novoEvento, setNovoEvento] = useState({
    data: '',
    evento: '',
    tipo: '📌',
});
const adicionarEvento = async () => {
    if (!novoEvento.data || !novoEvento.evento) {
    alert('Por favor, preencha todos os campos do novo evento.');
    return;
    }
    try {
    await createEvent(novoEvento).unwrap();
    alert('Evento adicionado com sucesso!');
    setNovoEvento({ data: '', evento: '', tipo: '📌' });
    eventRefetch();
    } catch (error) {
    console.error('Erro ao adicionar evento:', error);
    alert('Erro ao adicionar evento. Tente novamente.');
    }   
};
const deletarEvento = async (index: number) => {
    const eventoParaDeletar = events?.results[index];   
    if (!eventoParaDeletar) {
    alert('Evento não encontrado.');
    return;
    }
    try {
    await deleteEvent(eventoParaDeletar.id).unwrap();
    alert('Evento deletado com sucesso!');
    eventRefetch();
    } catch (error) {       
    console.error('Erro ao deletar evento:', error);
    alert('Erro ao deletar evento. Tente novamente.');
    }
};


return (
<div className="flex h-screen bg-gray-50">
    <div className="flex-1 flex flex-col overflow-hidden">
    {/* Header */}
    <header className="bg-white shadow-sm p-6 flex justify-between items-center border-b border-gray-200">
        <div>
        <h1 className="text-2xl font-bold text-gray-900">Calendário Escolar</h1>
        <p className="text-sm text-gray-600">
            {events?.results[0].data || 'Gerencie todos os dados da sua instituição'}
        </p>
        </div>
        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
        AD
        </div>
    </header>

    {/* Content */}
    <main className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
   
            <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <h2 className="text-2xl font-bold text-gray-900"></h2>

            {/* Novo Evento */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Adicionar Novo Evento</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Data</label>
                    <input 
                    type="date" 
                    value={novoEvento.data}
                    onChange={(e) => setNovoEvento({...novoEvento, data: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Evento</label>
                    <input 
                    type="text" 
                    placeholder="Ex: Prova Bimestral"
                    value={novoEvento.evento}
                    onChange={(e) => setNovoEvento({...novoEvento, evento: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Tipo</label>
                    <select 
                    value={novoEvento.tipo}
                    onChange={(e) => setNovoEvento({...novoEvento, tipo: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    >
                    <option value="📌">📌 Feriado</option>
                    <option value="📝">📝 Prova/Avaliação</option>
                    <option value="🎓">🎓 Formatura</option>
                    <option value="🎉">🎉 Evento Cultural</option>
                    </select>
                </div>
                </div>
                <button 
                onClick={adicionarEvento}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                >
                + Adicionar Evento
                </button>
            </div>

            {/* Tabela de Eventos */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-3 text-left font-bold">Data</th>
                    <th className="border border-gray-300 p-3 text-left font-bold">Evento</th>
                    <th className="border border-gray-300 p-3 text-left font-bold">Tipo</th>
                    <th className="border border-gray-300 p-3 text-left font-bold">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {events?.results.map((evento, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50 transition">
                        <td className="border border-gray-300 p-3">{evento.data}</td>
                        <td className="border border-gray-300 p-3">{evento.evento}</td>
                        <td className="border border-gray-300 p-3">{evento.tipo}</td>
                        <td className="border border-gray-300 p-3 flex gap-2">
                        <button className="text-blue-600 hover:underline font-semibold text-sm">Editar</button>
                        <button 
                            onClick={() => deletarEvento(index)}
                            className="text-red-600 hover:underline font-semibold text-sm"
                        >
                            Deletar
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        </div>
        
    </main>
    </div>
</div>
);
}