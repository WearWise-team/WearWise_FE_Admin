const Table = ({ columns, data }) => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left">
          <thead className="uppercase">
            <tr className="w-full bg-gray-100 border-b">
              {columns.map((col) => (
                <th key={col} className="py-2 px-4 text-left ">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b">
                {columns.map((col) => (
                  <td key={col} className="py-2 px-4 ">{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between p-4">
          <button className="px-4 py-2 bg-gray-200 rounded">Previous</button>
          <button className="px-4 py-2 bg-gray-200 rounded">Next</button>
        </div>
      </div>
    );
  };
  export default Table;