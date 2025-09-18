"use client"

import { useState } from "react"
import BookingLayout from "@/components/BookingLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  CreditCard,
  Search,
  Filter,
  ChevronDown
} from "lucide-react"

// Mock court data
const courts = [
  { id: 1, name: "Court 1", sport: "Badminton", status: "Available", price: "$30/hour" },
  { id: 2, name: "Court 2", sport: "Badminton", status: "Available", price: "$30/hour" },
  { id: 3, name: "Court 3", sport: "Badminton", status: "Booked", price: "$30/hour" },
  { id: 4, name: "Court 4", sport: "Badminton", status: "Available", price: "$30/hour" },
  { id: 5, name: "Court 5", sport: "Tennis", status: "Available", price: "$50/hour" },
  { id: 6, name: "Court 6", sport: "Tennis", status: "Booked", price: "$50/hour" },
  { id: 7, name: "Court 7", sport: "Basketball", status: "Available", price: "$40/hour" },
  { id: 8, name: "Court 8", sport: "Basketball", status: "Available", price: "$40/hour" },
]

// Mock time slots
const timeSlots = [
  "6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM",
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM",
  "9:00 PM", "9:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM"
]

export default function NewBookingPage() {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedSport, setSelectedSport] = useState("")
  const [selectedCourt, setSelectedCourt] = useState("")
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const sports = ["Badminton", "Tennis", "Basketball", "Volleyball", "Squash"]
  
  const filteredCourts = courts.filter(court => {
    const matchesSearch = court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         court.sport.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSport = !selectedSport || court.sport === selectedSport
    return matchesSearch && matchesSport
  })

  const handleTimeSlotClick = (timeSlot: string) => {
    setSelectedTimeSlots(prev => 
      prev.includes(timeSlot) 
        ? prev.filter(slot => slot !== timeSlot)
        : [...prev, timeSlot].sort()
    )
  }

  const calculateTotalPrice = () => {
    if (selectedCourt && selectedTimeSlots.length > 0) {
      const court = courts.find(c => c.name === selectedCourt)
      if (court) {
        const pricePerHour = parseInt(court.price.replace('$', '').replace('/hour', ''))
        return pricePerHour * selectedTimeSlots.length * 0.5 // 30-minute slots
      }
    }
    return 0
  }

  return (
    <BookingLayout>
      <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">New Booking</h1>
            <p className="text-slate-600 mt-1">Book your sports court in just a few steps</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Booking Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sport">Sport Type</Label>
                    <select
                      id="sport"
                      value={selectedSport}
                      onChange={(e) => setSelectedSport(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select Sport</option>
                      {sports.map(sport => (
                        <option key={sport} value={sport}>{sport}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Court Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Available Courts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                          placeholder="Search courts..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredCourts.map((court) => (
                      <div
                        key={court.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedCourt === court.name
                            ? 'border-teal-500 bg-teal-50'
                            : court.status === 'Available'
                            ? 'border-slate-200 hover:border-slate-300'
                            : 'border-slate-200 bg-slate-50 cursor-not-allowed'
                        }`}
                        onClick={() => court.status === 'Available' && setSelectedCourt(court.name)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{court.name}</h3>
                            <p className="text-sm text-slate-600">{court.sport}</p>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={court.status === 'Available' ? 'default' : 'secondary'}
                              className={court.status === 'Available' ? 'bg-green-100 text-green-800' : ''}
                            >
                              {court.status}
                            </Badge>
                            <p className="text-sm font-medium mt-1">{court.price}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time Slot Selection */}
            {selectedCourt && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Select Time Slots
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-6 gap-2">
                    {timeSlots.map((timeSlot) => (
                      <Button
                        key={timeSlot}
                        variant={selectedTimeSlots.includes(timeSlot) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleTimeSlotClick(timeSlot)}
                        className={`text-xs ${
                          selectedTimeSlots.includes(timeSlot)
                            ? 'bg-teal-600 hover:bg-teal-700'
                            : ''
                        }`}
                      >
                        {timeSlot}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Date:</span>
                    <span className="font-medium">{selectedDate || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Court:</span>
                    <span className="font-medium">{selectedCourt || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Time Slots:</span>
                    <span className="font-medium">{selectedTimeSlots.length} selected</span>
                  </div>
                  {selectedTimeSlots.length > 0 && (
                    <div className="text-sm text-slate-500">
                      {selectedTimeSlots.join(', ')}
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${calculateTotalPrice()}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  disabled={!selectedDate || !selectedCourt || selectedTimeSlots.length === 0}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Payment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </BookingLayout>
  )
}
