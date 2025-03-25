export default function RecommendedAccounts() {
    const accounts = [
      { name: "Bankless", handle: "@BanklessHQ", url: "https://x.com/BanklessHQ" },
      { name: "Nature is Amazing", handle: "@AMAZlNGNATURE", url: "https://x.com/AMAZlNGNATURE" },
      { name: "三上悠亜", handle: "@yua_mikami", url: "https://x.com/yua_mikami" },
    ];
  
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">推荐X账号</h2>
        <ul className="space-y-3">
          {accounts.map((account) => (
            <li key={account.handle}>
              <a href={account.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {account.name} <span className="text-gray-500">{account.handle}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }