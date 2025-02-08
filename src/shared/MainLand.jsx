export default function MainLand() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 overflow-hidden">
      <div className="flex space-x-12">
        <div className="w-[460px] h-[320px] flex flex-col items-center justify-center bg-white shadow-xl rounded-3xl border border-transparent hover:border-blue-500 transition-all p-8">
          <h2 className="text-4xl font-bold text-gray-800">Lender</h2>
          <p className="text-center text-gray-600 mt-4">
            Invest your money securely and earn great returns. Help businesses
            grow while ensuring profitable lending.
          </p>
          <a
            href="/lender"
            className="mt-6 px-10 py-3 bg-blue-500 text-white rounded-full text-lg font-medium shadow-md hover:bg-blue-600 transition-all"
          >
            Start Lending
          </a>
        </div>

        <div className="w-[460px] h-[320px] flex flex-col items-center justify-center bg-white shadow-xl rounded-3xl border border-transparent hover:border-blue-500 transition-all p-8">
          <h2 className="text-4xl font-bold text-gray-800">Borrower</h2>
          <p className="text-center text-gray-600 mt-4">
            Need financial support? Get fast, secure, and flexible loans to meet
            your personal or business needs.
          </p>
          <a
            href="/borrower"
            className="mt-6 px-10 py-3 bg-blue-500 text-white rounded-full text-lg font-medium shadow-md hover:bg-blue-600 transition-all"
          >
            Start Borrowing
          </a>
        </div>
      </div>
    </div>
  );
}
