const ErrorMessage = ({ message = 'Something went wrong.' }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm my-4">
    {message}
  </div>
);

export default ErrorMessage;
