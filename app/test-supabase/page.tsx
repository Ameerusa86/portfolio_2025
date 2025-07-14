import { supabase } from "@/lib/supabase";

export default async function TestSupabase() {
  console.log("Testing Supabase connection...");

  try {
    // Test the connection
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .limit(1);

    if (error) {
      console.error("Supabase connection error:", error);
      return (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          <h2>Supabase Connection Error</h2>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      );
    }

    return (
      <div className="p-4 bg-green-100 text-green-700 rounded">
        <h2>✅ Supabase Connection Successful</h2>
        <p>Connected to database successfully</p>
      </div>
    );
  } catch (error) {
    console.error("Supabase test error:", error);
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        <h2>Supabase Test Error</h2>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }
}
