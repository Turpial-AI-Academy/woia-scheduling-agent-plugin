# Scheduling contract

Source: WOIA Real Estate eb0a7278188b2f9968e21ed4299f08184d864cac; ADR-0026/0027/0029/0030 and docs/17,21,22,24,25.

Customer Service alone creates/reschedules/cancels appointments. Customer Service, Sales, Leasing, Property Management and Operations may receive scoped availability/read/status. Every operation requires a fresh exact host authority and accepted source; status requires attributable verified evidence. No calendar vendor is selected.

Stable Appointment ID, organization, resource, time interval, timezone and participants remain externally representable. Availability must be current and match exact slot; overlaps on one scoped resource are rejected. Host serializes atomic state/operation uniqueness so concurrency cannot double book. Expected version guards reschedule/cancel/status updates; duplicate operation is idempotent, changed payload conflicts.

Booking, confirmation and attendance are distinct. Creating an appointment does not confirm it or prove attendance. Reschedule invalidates prior confirmation/attendance; cancel preserves the observed history. Status observation cannot mutate booking under a read/status grant. Read/status checks resource before disclosure.

notify_external must explicitly be false for mutations. Returned notification route is a separate Customer Service/Communications intent; this helper performs no calendar invitation/reminder. Physical availability/readiness belongs to Operations; it cannot impersonate Customer Service. Qualified provider binding and real store contention/crash recovery remain NOT_RUN.
