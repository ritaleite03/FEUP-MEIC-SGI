class MyFileReader {

	/**
	   constructs the object
	*/
	constructor(onSceneLoadedCallback) {
		this.errorMessage = null;
		this.onSceneLoadedCallback = onSceneLoadedCallback;
	}

	open(jsonfile) {
		fetch(jsonfile)
			.then((res) => {
				if (!res.ok) {
					throw new Error(`HTTP error! Status: ${res.status}`);
				}
				return res.json();
			})
			.then((data) => {
				this.onSceneLoadedCallback(data);
			})
			.catch((error) =>
				console.error("Unable to fetch data:", error));
	};
	
}

export { MyFileReader };
