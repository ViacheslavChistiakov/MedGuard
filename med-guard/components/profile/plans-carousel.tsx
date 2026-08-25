"use client"

import { Children } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

// A thin carousel shell around pre-rendered slides - the slides themselves
// (CurrentPlanCard) are server components passed in as children, which Next
// allows even though this wrapper is a client component. Breakpoints match
// the plans grid (components/plans/plan-grid.tsx: 1 / sm:2 / lg:3).
//
// autoHeight: cards render at their own natural content height instead of
// being stretched to match their row's tallest sibling - Card has
// overflow-hidden, so forcing a shared height risks clipping content on
// plans with a longer name/description than their neighbors.
//
// Card's ring (its "border") is a 1px box-shadow drawn just outside its own
// edge, and .swiper itself clips with overflow: hidden - with zero padding,
// slides sit flush against that clip boundary and lose that outer pixel of
// ring on every side. Padding below gives the ring room on all four edges
// (extra at the bottom for the pagination dots) - set inline rather than
// via Tailwind classes because Swiper's own injected styles otherwise win
// the cascade for padding-top/left/right.
//
// Nav arrows are mouse/pointer affordances, not how touch users page through
// slides - on mobile, swiping is the interaction, so arrows only start off
// at the sm breakpoint. Swiper breakpoints don't cascade from one another
// (only the base params do), so `navigation: true` has to be repeated at
// every breakpoint that should show them.
export function PlansCarousel({ children }: { children: React.ReactNode }) {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation={false}
      pagination={{ clickable: true }}
      watchOverflow
      autoHeight
      spaceBetween={16}
      slidesPerView={1}
      breakpoints={{
        640: { slidesPerView: 2, navigation: true },
        1024: { slidesPerView: 3, navigation: true },
      }}
      style={{ padding: "4px", paddingBottom: "40px" }}
    >
      {Children.map(children, (child, index) => <SwiperSlide key={index}>{child}</SwiperSlide>)}
    </Swiper>
  )
}
