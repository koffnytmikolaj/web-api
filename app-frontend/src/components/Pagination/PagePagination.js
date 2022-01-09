import { Component } from 'react';
import { Pagination } from 'react-bootstrap';

export class PagePagination extends Component {

    render() {

        let appPath = this.props.appPath;
        let numberOfPages = this.props.numberOfPages;
        let currentPage = this.props.currentPage;

        let leftArrows = Number(currentPage) === 1;
        let firstPage = leftArrows ? "none" : "block";
        let leftEllipsis = Number(currentPage) >= 5 ? "block" : "none" ;
        let prePrePage = Number(currentPage) >= 4 ? "block" : "none" ;
        let prePage = Number(currentPage) >= 3 ? "block" : "none" ;
        let nextPage = Number(currentPage) + 2 <= Number(numberOfPages) ? "block" : "none" ;
        let nextNextPage = Number(currentPage) + 3 <= Number(numberOfPages) ? "block" : "none" ;
        let rightEllipsis = Number(currentPage) + 4 <= Number(numberOfPages) ? "block" : "none" ;
        let rightArrows = Number(numberOfPages) <= Number(currentPage);
        let lastPage = rightArrows ? "none" : "block";

        return(
            <Pagination>
                <Pagination.First href={appPath + 1} disabled={leftArrows} />

                <Pagination.Prev href={appPath + (Number(currentPage) - 1)} disabled={leftArrows} />

                <Pagination.Item href={appPath + 1} style={{display: firstPage}} >
                    1
                </Pagination.Item>

                <Pagination.Ellipsis disabled style={{display: leftEllipsis}} />

                <Pagination.Item href={appPath + (Number(currentPage) - 2)} style={{display: prePrePage}}>
                    {Number(currentPage) - 2}
                </Pagination.Item>

                <Pagination.Item href={appPath + (Number(currentPage) - 1)} style={{display: prePage}}>
                    {Number(currentPage) - 1}
                </Pagination.Item>

                <Pagination.Item active>
                    {currentPage}
                </Pagination.Item>

                <Pagination.Item href={appPath + (Number(currentPage) + 1)} style={{display: nextPage}}>
                    {Number(currentPage) + 1}
                </Pagination.Item>

                <Pagination.Item href={appPath + (Number(currentPage) + 2)} style={{display: nextNextPage}}>
                    {Number(currentPage) + 2}
                </Pagination.Item>

                <Pagination.Ellipsis disabled style={{display: rightEllipsis}} />

                <Pagination.Item href={appPath + numberOfPages} style={{display: lastPage}}>
                    {numberOfPages}
                </Pagination.Item>

                <Pagination.Next href={appPath + (Number(currentPage) + 1)} disabled={rightArrows} />

                <Pagination.Last href={appPath + numberOfPages} disabled={rightArrows} />
            </Pagination>

        );
    }
}
