xdescribe("API Response", function() {
        expect(data.hasOwnProperty("Westbound - Platform 1")).toBe(true);
        expect(data.hasOwnProperty("Eastbound - Platform 2")).toBe(true);
        expect(data["Westbound - Platform 1"].length).toBe(6);
        expect(data["Eastbound - Platform 2"].length).toBe(4);
});
