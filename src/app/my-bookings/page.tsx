"use client"

import { useState } from "react"
import BookingLayout from "@/components/BookingLayout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { 
  Grid3X3, 
  List, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Hash
} from "lucide-react"

// Mock booking data
const bookings = [
  {
    id: "BCK-20250915-4",
    sport: "Badminton",
    status: "Booked",
    dates: 1,
    court: "Court 10",
    duration: "210 mins",
    date: "Sep 15, 2025",
    day: "Mon",
    timeSlot: "6:00 PM - 6:30 PM",
    additionalSlots: 6,
    price: "$105",
    paymentStatus: "Paid",
    bookingDate: "Sep 15, 2025"
  },
  {
    id: "BCK-20250915-5",
    sport: "Badminton",
    status: "Booked",
    dates: 1,
    court: "Court 6",
    duration: "120 mins",
    date: "Sep 15, 2025",
    day: "Mon",
    timeSlot: "9:00 PM - 9:30 PM",
    additionalSlots: 3,
    price: "$60",
    paymentStatus: "Paid",
    bookingDate: "Sep 15, 2025"
  },
  {
    id: "BCK-20250915-6",
    sport: "Badminton",
    status: "Booked",
    dates: 1,
    court: "Court 8",
    duration: "60 mins",
    date: "Sep 15, 2025",
    day: "Mon",
    timeSlot: "8:00 PM - 8:30 PM",
    additionalSlots: 1,
    price: "$30",
    paymentStatus: "Paid",
    bookingDate: "Sep 15, 2025"
  },
  {
    id: "BCK-20250915-7",
    sport: "Badminton",
    status: "Booked",
    dates: 1,
    court: "Court 3",
    duration: "90 mins",
    date: "Sep 15, 2025",
    day: "Mon",
    timeSlot: "7:00 PM - 7:30 PM",
    additionalSlots: 2,
    price: "$45",
    paymentStatus: "Paid",
    bookingDate: "Sep 15, 2025"
  },
  {
    id: "BCK-20250915-8",
    sport: "Badminton",
    status: "Booked",
    dates: 1,
    court: "Court 1",
    duration: "120 mins",
    date: "Sep 15, 2025",
    day: "Mon",
    timeSlot: "5:00 PM - 5:30 PM",
    additionalSlots: 3,
    price: "$60",
    paymentStatus: "Paid",
    bookingDate: "Sep 15, 2025"
  },
  {
    id: "BCK-20250915-9",
    sport: "Badminton",
    status: "Booked",
    dates: 1,
    court: "Court 2",
    duration: "150 mins",
    date: "Sep 15, 2025",
    day: "Mon",
    timeSlot: "4:00 PM - 4:30 PM",
    additionalSlots: 4,
    price: "$75",
    paymentStatus: "Paid",
    bookingDate: "Sep 15, 2025"
  }
]

export default function MyBookingsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('dateCreated')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const sortOptions = [
    { key: 'dateCreated', label: 'Date Created', icon: ChevronDown },
    { key: 'startDate', label: 'Start Date', icon: ChevronUp },
    { key: 'amount', label: 'Amount', icon: ChevronUp },
    { key: 'status', label: 'Status', icon: ChevronUp },
    { key: 'payment', label: 'Payment', icon: ChevronUp },
  ]

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(key)
      setSortOrder('asc')
    }
  }

  return (
    <BookingLayout>
      <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
            <p className="text-slate-600 mt-1">View and manage your sports court bookings</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" className="h-8">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Booking Count and Sort Options */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700">Sort by:</span>
            {sortOptions.map((option) => (
              <Button
                key={option.key}
                variant={sortBy === option.key ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleSort(option.key)}
                className={`h-8 text-xs ${
                  sortBy === option.key 
                    ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {option.label}
                {sortBy === option.key && (
                  sortOrder === 'desc' ? <ChevronDown className="h-3 w-3 ml-1" /> : <ChevronUp className="h-3 w-3 ml-1" />
                )}
              </Button>
            ))}
          </div>
          <div className="text-sm text-slate-600">
            <span className="font-medium">28 bookings</span>
          </div>
        </div>
      </div>

      {/* Booking Cards */}
      <div className="p-6">
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              {/* Card Header */}
              <CardHeader className="bg-teal-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{booking.sport}</h3>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{booking.dates} dates</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{booking.court}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{booking.duration}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              {/* Card Body */}
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Date and Court */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <span className="font-medium">{booking.date}</span>
                      <span className="text-slate-500">({booking.day})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <span className="font-medium">{booking.court}</span>
                    </div>
                  </div>

                  {/* Time Slot */}
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <span className="font-medium">{booking.timeSlot}</span>
                    {booking.additionalSlots > 0 && (
                      <Badge variant="outline" className="text-xs">
                        +{booking.additionalSlots} more slots
                      </Badge>
                    )}
                  </div>

                  {/* Price and Payment */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-slate-500" />
                      <span className="text-lg font-bold text-slate-900">{booking.price}</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                      {booking.paymentStatus}
                    </Badge>
                  </div>

                  {/* Booking ID and Date */}
                  <div className="flex items-center justify-between text-sm text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      <span>{booking.id}</span>
                    </div>
                    <span>{booking.bookingDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      </div>
    </BookingLayout>
  )
}
