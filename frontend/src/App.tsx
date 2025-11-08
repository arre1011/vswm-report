import { AddressForm } from "@/components/AddressForm"

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            VSME Report
          </h1>
          <p className="text-muted-foreground">
            Willkommen zu Ihrem VSME Report Projekt
          </p>
        </div>
        <AddressForm />
      </div>
    </div>
  )
}

export default App

