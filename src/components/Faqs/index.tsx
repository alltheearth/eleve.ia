import { useGetFaqsQuery, useUpdateFaqMutation } from "../../services/faqsApi";

 const Faqs = () => {

    const { data: faqs, isLoading: faqsisLoading, error: faqIs, refetch: faqRefetch } = useGetFaqsQuery();
    const [updateFaq, { isLoading: faqIsUpdating }] = useUpdateFaqMutation();

  return (<>
     <header className="bg-white shadow-sm p-6 flex justify-between items-center border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Perguntas Frequentes (FAQs)</h1>
            <p className="text-sm text-gray-600">
              {faqs?.results[0].escola_nome || 'Gerencie todas as perguntas frequentes da sua instituição'}
            </p>
          </div>
          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
            AD
          </div>
        </header>
     <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            
       <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                <h2 className="text-2xl font-bold text-gray-900"></h2>

                <div className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    placeholder="Buscar FAQs..." 
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
                    + Nova FAQ
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-3 text-left font-bold">#</th>
                        <th className="border border-gray-300 p-3 text-left font-bold">Pergunta</th>
                        <th className="border border-gray-300 p-3 text-left font-bold">Categoria</th>
                        <th className="border border-gray-300 p-3 text-left font-bold">Status</th>
                        <th className="border border-gray-300 p-3 text-left font-bold">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faqs?.results.map((faq) => (
                        <tr key={faq.id} className="border-b hover:bg-gray-50 transition">
                          <td className="border border-gray-300 p-3">{faq.id}</td>
                          <td className="border border-gray-300 p-3 font-medium">{faq.pergunta}</td>
                          <td className="border border-gray-300 p-3">{faq.categoria}</td>
                          <td className="border border-gray-300 p-3">
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">✅ Ativa</span>
                          </td>
                          <td className="border border-gray-300 p-3 flex gap-2">
                            <button className="text-blue-600 hover:underline font-semibold text-sm">Editar</button>
                            <button className="text-red-600 hover:underline font-semibold text-sm">Deletar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
        </main>
    </>
  )
}

export default Faqs;