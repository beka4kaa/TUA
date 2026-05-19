"use client";

import { useState, useEffect, useCallback } from "react";
import { format, addDays, isBefore, startOfDay, isWeekend } from "date-fns";
import { CalendarIcon, Clock, CheckCircle2, Download, ExternalLink, Loader2, Video } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/contexts/auth-context";
import { bookingsApi, Booking as ApiBooking } from "@/lib/api";
import { DashboardShell, DashboardHeader } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Time slots available (Mon-Fri 10:00-18:00)
const TIME_SLOTS = [
    "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
];

// Google Meet link for consultations (set in .env)
const GOOGLE_MEET_LINK = process.env.NEXT_PUBLIC_GOOGLE_MEET_LINK || "https://meet.google.com/stockermans-consult-room";

interface Booking {
    id: string;
    date: string;
    time: string;
    status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
    createdAt: string;
}

export default function BookingsPage() {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
    const [lastBooking, setLastBooking] = useState<Booking | null>(null);
    const [isRefetching, setIsRefetching] = useState(false);

    // Fetch all booked slots (from any user) for availability display
    const refetchBookedSlots = useCallback(async () => {
        try {
            const today = format(new Date(), "yyyy-MM-dd");
            const maxDate = format(addDays(new Date(), 60), "yyyy-MM-dd");
            const data = await bookingsApi.getBookedSlots({ from: today, to: maxDate });
            setBookedSlots(new Set(data.bookedSlots));
        } catch (err) {
            console.error("Failed to fetch booked slots:", err);
        }
    }, []);

    // Reusable function to fetch/refresh user's own bookings
    const refetchBookings = useCallback(async () => {
        setIsRefetching(true);
        try {
            const data = await bookingsApi.list();
            // API returns { items: [...], total, page, pageSize, totalPages }
            const bookingsArray = data.items ?? [];
            const transformedBookings: Booking[] = bookingsArray.map((b: ApiBooking) => ({
                id: b.id.toString(),
                date: b.scheduledDate,
                time: b.scheduledTime?.slice(0, 5) ?? "",
                status: (b.status?.toUpperCase() ?? "PENDING") as Booking["status"],
                createdAt: b.createdAt,
            }));
            setBookings(transformedBookings);
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
        } finally {
            setIsRefetching(false);
        }
    }, []);

    // Refresh both user bookings and all booked slots
    const refreshAll = useCallback(async () => {
        await Promise.all([refetchBookings(), refetchBookedSlots()]);
    }, [refetchBookings, refetchBookedSlots]);

    // Fetch user's bookings and all booked slots on mount
    useEffect(() => {
        refreshAll();
    }, [refreshAll]);

    const isDateDisabled = (date: Date) => {
        const today = startOfDay(new Date());
        // Disable past dates, today, and weekends
        return isBefore(date, addDays(today, 1)) || isWeekend(date);
    };

    const isTimeSlotBooked = (time: string) => {
        if (!selectedDate) return false;
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        return bookedSlots.has(`${dateStr}_${time}`);
    };

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        setSelectedTime(null);
    };

    const handleTimeSelect = (time: string) => {
        if (isTimeSlotBooked(time)) {
            toast.error("This time slot is already booked", {
                description: "Please select a different time.",
            });
            return;
        }
        setSelectedTime(time);
    };

    const handleConfirmBooking = async () => {
        if (!selectedDate || !selectedTime) return;

        setIsLoading(true);
        try {
            const dateStr = format(selectedDate, "yyyy-MM-dd");

            const booking = await bookingsApi.create({
                scheduled_date: dateStr,
                scheduled_time: `${selectedTime}:00`,
                notes: "",
            });

            const newBooking: Booking = {
                id: booking.id.toString(),
                date: booking.scheduledDate,
                time: booking.scheduledTime?.slice(0, 5),
                status: booking.status?.toUpperCase() as Booking["status"],
                createdAt: booking.createdAt,
            };

            // Immediately update local state
            setBookings((prev) => [newBooking, ...prev]);
            setBookedSlots((prev) => new Set(prev).add(`${dateStr}_${selectedTime}`));
            setLastBooking(newBooking);
            setConfirmDialogOpen(false);
            setSuccessDialogOpen(true);
            setSelectedDate(undefined);
            setSelectedTime(null);
            toast.success("Booking confirmed!");

            // Also refresh from server to ensure we have latest data
            await refreshAll();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to create booking";
            const isDoubleBooking = errorMessage.toLowerCase().includes("already booked") ||
                errorMessage.toLowerCase().includes("slot") ||
                errorMessage.toLowerCase().includes("time slot");

            if (isDoubleBooking) {
                toast.error("This time slot is already booked. Please choose another time.", {
                    description: "The availability has been refreshed.",
                });
                // Clear selection since the slot is taken
                setSelectedTime(null);
                setConfirmDialogOpen(false);
            } else {
                toast.error(errorMessage);
            }

            // Refresh both bookings and slots on any error to sync with server state
            await refreshAll();
        } finally {
            setIsLoading(false);
        }
    };

    const generateIcsFile = (booking: Booking) => {
        const startDate = new Date(`${booking.date}T${booking.time}:00`);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later

        const formatIcsDate = (date: Date) => {
            return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
        };

        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Stockermans//Booking//EN
BEGIN:VEVENT
UID:${booking.id}@topuniversitiesadvisors.com
DTSTAMP:${formatIcsDate(new Date())}
DTSTART:${formatIcsDate(startDate)}
DTEND:${formatIcsDate(endDate)}
SUMMARY:Consultation with Stockermans
DESCRIPTION:Your scheduled consultation session with Stockermans.\n\nJoin Google Meet: ${GOOGLE_MEET_LINK}
LOCATION:${GOOGLE_MEET_LINK}
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `stockermans-booking-${booking.date}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const generateGoogleCalendarUrl = (booking: Booking) => {
        const startDate = new Date(`${booking.date}T${booking.time}:00`);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

        const formatGoogleDate = (date: Date) => {
            return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
        };

        const params = new URLSearchParams({
            action: "TEMPLATE",
            text: "Consultation with Stockermans",
            dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
            details: `Your scheduled consultation session with Stockermans.\n\n🔗 Join Google Meet: ${GOOGLE_MEET_LINK}`,
            location: GOOGLE_MEET_LINK,
        });

        return `https://calendar.google.com/calendar/render?${params.toString()}`;
    };

    // Helper to parse booking date+time into a Date object
    const parseBookingDateTime = (booking: Booking): Date => {
        const timeStr = booking.time || "00:00";
        return new Date(`${booking.date}T${timeStr}:00`);
    };

    // Helper to check if booking is upcoming
    const isUpcomingBooking = (booking: Booking): boolean => {
        if (booking.status === "CANCELLED" || booking.status === "COMPLETED") return false;
        const bookingDateTime = parseBookingDateTime(booking);
        return bookingDateTime >= now;
    };

    // Helper to check if booking is in history
    const isHistoryBooking = (booking: Booking): boolean => {
        if (booking.status === "CANCELLED" || booking.status === "COMPLETED") return true;
        const bookingDateTime = parseBookingDateTime(booking);
        return bookingDateTime < now;
    };

    // Calculate today's start for filtering (show all bookings from today onwards)
    const now = new Date();

    const upcomingBookings = bookings.filter(isUpcomingBooking);
    const pastBookings = bookings.filter(isHistoryBooking);

    return (
        <DashboardShell>
            <DashboardHeader
                title="My Bookings"
                description="Schedule and manage your consultation sessions"
            />

            <Tabs defaultValue="schedule" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="schedule">Schedule New</TabsTrigger>
                    <TabsTrigger value="upcoming">
                        Upcoming ({upcomingBookings.length})
                    </TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                {/* Schedule New Booking */}
                <TabsContent value="schedule">
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Calendar */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CalendarIcon className="h-5 w-5" />
                                    Select a Date
                                </CardTitle>
                                <CardDescription>
                                    Choose an available date for your consultation
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={handleDateSelect}
                                    disabled={isDateDisabled}
                                    className="rounded-md border"
                                    fromDate={addDays(new Date(), 1)}
                                    toDate={addDays(new Date(), 60)}
                                />
                                <p className="text-xs text-muted-foreground mt-4">
                                    Available Monday to Friday. Select a date to see available times.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Time Slots */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    Select a Time
                                </CardTitle>
                                <CardDescription>
                                    {selectedDate
                                        ? `Available times for ${format(selectedDate, "EEEE, MMMM d, yyyy")}`
                                        : "Select a date first to see available times"
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {selectedDate ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {TIME_SLOTS.map((time) => {
                                            const isBooked = isTimeSlotBooked(time);
                                            const isSelected = selectedTime === time;
                                            return (
                                                <div key={time} className="relative">
                                                    <Button
                                                        variant={isSelected ? "default" : "outline"}
                                                        className={cn(
                                                            "h-12 w-full font-semibold",
                                                            isBooked && "bg-muted text-muted-foreground border-muted cursor-not-allowed opacity-60",
                                                            isSelected && "bg-[#8B3B3B] hover:bg-[#8B3B3B]/90 text-white border-none"
                                                        )}
                                                        onClick={() => handleTimeSelect(time)}
                                                        disabled={isBooked}
                                                    >
                                                        {time}
                                                    </Button>
                                                    {isBooked && (
                                                        <Badge
                                                            variant="secondary"
                                                            className="absolute -top-2 -right-2 text-xs px-1.5 py-0.5"
                                                        >
                                                            Booked
                                                        </Badge>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                                        <CalendarIcon className="h-12 w-12 mb-4 opacity-50" />
                                        <p>Please select a date first</p>
                                    </div>
                                )}

                                {selectedDate && selectedTime && (
                                    <div className="mt-6 pt-6 border-t">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <p className="font-medium">Selected:</p>
                                                <p className="text-muted-foreground">
                                                    {format(selectedDate, "EEEE, MMMM d, yyyy")} at {selectedTime}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            className="w-full bg-[#8B3B3B] hover:bg-[#8B3B3B]/90"
                                            onClick={() => setConfirmDialogOpen(true)}
                                        >
                                            Confirm Booking
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Upcoming Bookings */}
                <TabsContent value="upcoming">
                    {upcomingBookings.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <CalendarIcon className="h-12 w-12 mb-4 text-muted-foreground opacity-50" />
                                <p className="text-muted-foreground mb-4">No upcoming bookings</p>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        const tab = document.querySelector('[value="schedule"]');
                                        if (tab) (tab as HTMLElement).click();
                                    }}
                                >
                                    Schedule a Consultation
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {upcomingBookings.map((booking) => (
                                <Card key={booking.id}>
                                    <CardContent className="flex items-center justify-between py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-[#2F3B69]/10 flex items-center justify-center">
                                                <CalendarIcon className="h-6 w-6 text-[#2F3B69]" />
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    {format(new Date(booking.date), "EEEE, MMMM d, yyyy")}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {booking.time} • 1 hour session
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={booking.status === "CONFIRMED" ? "default" : "secondary"}
                                                className={booking.status === "CONFIRMED" ? "bg-green-500" : ""}
                                            >
                                                {booking.status}
                                            </Badge>
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className="bg-[#8B3B3B] hover:bg-[#6F2F2F] gap-2"
                                                onClick={() => window.open(GOOGLE_MEET_LINK, "_blank")}
                                            >
                                                <Video className="h-4 w-4" />
                                                Join Meeting
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => generateIcsFile(booking)}
                                                title="Download .ics file"
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => window.open(generateGoogleCalendarUrl(booking), "_blank")}
                                                title="Add to Google Calendar"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* History */}
                <TabsContent value="history">
                    {pastBookings.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Clock className="h-12 w-12 mb-4 text-muted-foreground opacity-50" />
                                <p className="text-muted-foreground">No past bookings</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {pastBookings.map((booking) => (
                                <Card key={booking.id} className="opacity-75">
                                    <CardContent className="flex items-center justify-between py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                                <CalendarIcon className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    {format(new Date(booking.date), "EEEE, MMMM d, yyyy")}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {booking.time} • 1 hour session
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant="outline">
                                            {booking.status === "CANCELLED" ? "Cancelled" : "Completed"}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Confirm Booking Dialog */}
            <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Your Booking</DialogTitle>
                        <DialogDescription>
                            Please review the details of your consultation
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                            <CalendarIcon className="h-5 w-5 text-[#2F3B69]" />
                            <div>
                                <p className="font-medium">
                                    {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {selectedTime} • 1 hour session
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            By confirming, you agree to our consultation terms. You will receive a confirmation email with meeting details.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-[#8B3B3B] hover:bg-[#8B3B3B]/90"
                            onClick={handleConfirmBooking}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Confirming...
                                </>
                            ) : (
                                "Confirm Booking"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Success Dialog */}
            <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                            Booking Confirmed!
                        </DialogTitle>
                        <DialogDescription>
                            Your consultation has been scheduled successfully
                        </DialogDescription>
                    </DialogHeader>
                    {lastBooking && (
                        <div className="py-4 space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <CalendarIcon className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="font-medium text-green-900">
                                        {format(new Date(lastBooking.date), "EEEE, MMMM d, yyyy")}
                                    </p>
                                    <p className="text-sm text-green-700">
                                        {lastBooking.time} • 1 hour session
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Add this event to your calendar:
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => generateIcsFile(lastBooking)}
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Download .ics
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => window.open(generateGoogleCalendarUrl(lastBooking), "_blank")}
                                >
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Google Calendar
                                </Button>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setSuccessDialogOpen(false)}>
                            Done
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardShell>
    );
}
