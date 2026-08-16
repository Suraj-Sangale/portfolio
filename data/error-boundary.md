# Error Boundary Implementation Documentation

This document outlines how the Error Boundary pattern was implemented in this project using `react-error-boundary`. It serves as a reference for applying this pattern in future projects to gracefully handle component crashes and prevent the entire application from breaking.

## 1. Overview
The implementation utilizes the `react-error-boundary` library to catch JavaScript errors anywhere in a child component tree, log those errors, and display a fallback UI instead of crashing the whole component tree. 

Two main files are involved in this implementation:
- **Fallback Component**: `CustomErrorFallback.js` (The UI shown when an error occurs)
- **Component Wrappers**: `homeWrapper.js` and `productListWrapper.js` (Where the `ErrorBoundary` is applied)

## 2. Dependencies
To use this in future projects, ensure the required package is installed:
```bash
npm install react-error-boundary
```

## 3. The Fallback Component (`CustomErrorFallback.js`)
The `CustomErrorFallback` component acts as the UI that renders when a wrapped component throws an error.

### Location:
[`components/common/CustomErrorFallback.js`](file:///c:/Users/Fortune%204/Desktop/Titan/TEP-next-16/Titan-Eyeplus-Headless/components/common/CustomErrorFallback.js)

### Code Structure:
```javascript
import { useEffect } from "react";

export default function CustomErrorFallback({ error = "", resetErrorBoundary }) {
	useEffect(() => {
		// Example of sending the error to a backend service.
		// NOTE: In this specific project, it repurposed the appointment form API to log errors.
		// For future projects, use a proper logging endpoint or service (e.g., Sentry, Datadog).
		const handleFormSubmit = async () => {
			const payload = {
				full_name: `Error Log: ${error}`,
				errorMsg: `-${error.toString()}-`,
				// ... other fields required by your logging endpoint
			};
			// const response = await postApiData("YOUR_LOGGING_API", payload);
		};
		handleFormSubmit();
	}, [error]);

	return (
		<div
			role="alert"
			style={{
				padding: "1rem",
				margin: "1rem 0",
				borderRadius: "4px",
				backgroundColor: "#fff4f4",
				color: "#b00020",
				border: "1px solid #f5c2c7",
			}}
		>
			<h3 style={{ marginTop: 0 }}>Something went wrong.</h3>
			<p style={{ marginBottom: "0.5rem" }}>
				We're sorry, but this section of the page failed to load.
			</p>
			
			{/* Development Only: Show technical error details */}
			{process.env.NODE_ENV !== "production" && error?.message && (
				<pre
					style={{
						whiteSpace: "pre-wrap",
						wordBreak: "break-word",
						backgroundColor: "#fff",
						padding: "0.5rem",
						borderRadius: "4px",
						border: "1px dashed #f5c2c7",
						fontSize: "0.85rem",
						marginBottom: "0.75rem",
					}}
				>
					{error.message}
				</pre>
			)}
		</div>
	);
}
```

> [!NOTE]
> The current implementation uses a creative workaround to log errors to the `APPOINTMENT_FORM_SUBMIT` API with hardcoded mock user data. In future projects, replace this with a dedicated error logging service or endpoint.

## 4. Usage Examples

### Example A: Advanced Usage with Error State (`homeWrapper.js`)
This approach stores the error message in the component's state to pass it down to the fallback component.

**Implementation:**
[`components/home/homeWrapper.js`](file:///c:/Users/Fortune%204/Desktop/Titan/TEP-next-16/Titan-Eyeplus-Headless/components/home/homeWrapper.js)
```javascript
import { ErrorBoundary } from "react-error-boundary";
import CustomErrorFallback from "@/components/common/CustomErrorFallback";
import { useState } from "react";

export default function HomeWrapper() {
	const [componentError, setComponentError] = useState("");

	return (
		<ErrorBoundary
			FallbackComponent={() => <CustomErrorFallback error={componentError} />}
			onError={(error, info) => {
				console.log("Error in component rendering==:", error, info);
				setComponentError(error.message); // Store error to pass to fallback
			}}
		>
			<HomeBannerFull
				bannerData={jsonData.hero_banners}
				sectionID="herobanner"
				isMobile={isMobile}
			/>
		</ErrorBoundary>
	);
}
```

### Example B: Simple Usage (`productListWrapper.js`)
This is a simpler approach where the fallback component is rendered without explicitly passing the error state down, but the error is still caught and logged.

**Implementation:**
[`components/product_list/productListWrapper.js`](file:///c:/Users/Fortune%204/Desktop/Titan/TEP-next-16/Titan-Eyeplus-Headless/components/product_list/productListWrapper.js)
```javascript
import { ErrorBoundary } from "react-error-boundary";
import CustomErrorFallback from "@/common/CustomErrorFallback";

export default function ProductListWrapper() {
	return (
		<ErrorBoundary
			FallbackComponent={() => <CustomErrorFallback />}
			onError={(error, info) => {
				console.error("Error in component render:", error, info);
			}}
		>
			<CategoryTopSection
				heading={pageData?.top_section?.heading}
				topSectionData={filteredTopSectionData}
				pageData={pageData}
			/>
		</ErrorBoundary>
	);
}
```

## 5. Best Practices for Future Projects

> [!TIP]
> Keep these best practices in mind when porting this pattern to your next project:

1. **Dedicated Error Logging Service**: Instead of hijacking an unrelated API (like the appointment form API), integrate a proper error tracking service like Sentry, LogRocket, or Datadog inside the `onError` prop or inside the `useEffect` of your fallback component.
2. **Granular Wrapping**: Don't just wrap the top-level app in an Error Boundary. Wrap individual feature sections or complex widgets (like carousels, lists, or forms). This way, if one widget fails, the rest of the page remains interactive.
3. **Recovery Action**: The `react-error-boundary` library provides a `resetErrorBoundary` prop. In the future, you can uncomment the "Try again" button in `CustomErrorFallback.js` and use it to allow users to attempt to re-render the crashed component without refreshing the whole page.
4. **Consistent Import Paths**: Ensure your aliases are consistent. (e.g. using `@/components/common/CustomErrorFallback` vs `@/common/CustomErrorFallback`).
