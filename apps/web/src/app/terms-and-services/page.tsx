"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function TermsAndServices() {
  return (
    <div className="min-h-screen bg-[#F4F4F4] dark:bg-background text-foreground">
      <div className="border-b border-border">
        <div className="container mx-auto max-w-4xl px-4 py-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              ← Back
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-[#BD9267]">Terms of Service</h1>
          <p className="text-muted-foreground mt-2">Last updated: December 2025</p>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#BD9267]">1. Agreement to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <p>
                By accessing and using this website and service, you accept and agree to be bound by the terms and
                provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#BD9267]">2. Use License</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on our
                service for personal, non-commercial transitory viewing only. This is the grant of a license, not a
                transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose or for any public display</li>
                <li>Attempting to decompile or reverse engineer any software contained on the service</li>
                <li>Removing any copyright or other proprietary notations from the materials</li>
                <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#BD9267]">3. Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <p>
                The materials on our service are provided on an 'as is' basis. We make no warranties, expressed or
                implied, and hereby disclaim and negate all other warranties including, without limitation, implied
                warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of
                intellectual property or other violation of rights.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#BD9267]">4. Limitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <p>
                In no event shall our company or its suppliers be liable for any damages (including, without limitation,
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability
                to use the materials on our service, even if we or our authorized representative has been notified
                orally or in writing of the possibility of such damage.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#BD9267]">5. Accuracy of Materials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <p>
                The materials appearing on our service could include technical, typographical, or photographic errors.
                We do not warrant that any of the materials on our service are accurate, complete, or current. We may
                make changes to the materials contained on our service at any time without notice.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#BD9267]">6. Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <p>
                We have not reviewed all of the sites linked to our website and are not responsible for the contents of
                any such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any
                such linked website is at the user's own risk.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#BD9267]">7. Modifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <p>
                We may revise these terms of service for our service at any time without notice. By using this service,
                you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#BD9267]">8. Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction
                in which the company is located, and you irrevocably submit to the exclusive jurisdiction of the courts
                in that location.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/">
            <Button className="bg-[#BD9267] hover:bg-[#a0815a] text-white">Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
